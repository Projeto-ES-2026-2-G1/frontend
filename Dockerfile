# syntax=docker/dockerfile:1.7

# ==============================================================================
# Phase 1: Base Node.js Environment
# ==============================================================================
ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=1.27-alpine-slim

FROM node:${NODE_VERSION} AS base

ENV CI=1 \
    EXPO_NO_TELEMETRY=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

WORKDIR /app

# ==============================================================================
# Phase 2: Dependencies Installation (Cached Layer + BuildKit Cache Mount)
# ==============================================================================
FROM base AS deps

# Copy only lockfile and manifest first so source code edits never bust this layer
COPY --link package.json package-lock.json ./

# Mount persistent npm cache across builds so tarball downloads are reused even when lockfile changes
RUN --mount=type=cache,id=simplimei-npm-cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# ==============================================================================
# Phase 3: Quality Gate — Typecheck & Lint (Optional CI Target: --target check)
# ==============================================================================
FROM deps AS check

COPY --link app.json tsconfig.json eslint.config.js ./
COPY --link assets ./assets
COPY --link src ./src

RUN npx tsc --noEmit && npx expo lint

# ==============================================================================
# Phase 4: Development Server (Optional Dev Target: --target dev)
# ==============================================================================
FROM deps AS dev

ENV NODE_ENV=development
COPY --link app.json tsconfig.json eslint.config.js ./
COPY --link assets ./assets
COPY --link src ./src

EXPOSE 8081
CMD ["npx", "expo", "start", "--web", "--port", "8081"]

# ==============================================================================
# Phase 5: Production Web Builder (Metro Static Export + Pre-compression)
# ==============================================================================
FROM deps AS builder

ARG EXPO_PUBLIC_API_URL=""
ENV NODE_ENV=production \
    EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

# Copy only build-relevant files to maximize cache hits
COPY --link app.json tsconfig.json ./
COPY --link assets ./assets
COPY --link src ./src

# Export static web bundle using persistent BuildKit cache for Metro & Expo
RUN --mount=type=cache,id=simplimei-metro-cache,target=/tmp/metro-cache \
    --mount=type=cache,id=simplimei-expo-cache,target=/app/.expo/web/cache \
    npx expo export --platform web --output-dir dist && \
    find dist -type f \( \
      -name '*.js' -o \
      -name '*.css' -o \
      -name '*.html' -o \
      -name '*.json' -o \
      -name '*.svg' -o \
      -name '*.ico' -o \
      -name '*.ttf' \
    \) -exec gzip -k -9 {} +

# ==============================================================================
# Phase 6: Production Runtime (Ultra-lightweight Nginx with Static Gzip & Cache)
# ==============================================================================
FROM nginx:${NGINX_VERSION} AS runtime

# Configure Nginx for Expo Router static rendering (web.output: "static")
COPY --link <<-'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    listen [::]:80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;
    charset utf-8;

    # Hide Nginx version for security
    server_tokens off;

    # Serve pre-compressed .gz files from the builder phase with zero CPU overhead
    gzip on;
    gzip_static on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/manifest+json
        image/svg+xml
        font/ttf
        font/woff
        font/woff2;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Lightweight container healthcheck endpoint
    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 "ok\n";
    }

    # Immutable 1-year cache for content-hashed Expo JS/CSS bundles and assets
    location ~* ^/(_expo/static|assets)/ {
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header X-Content-Type-Options "nosniff" always;
        try_files $uri =404;
    }

    # HTML entrypoints and route pages: always revalidate so deploys take effect immediately
    location / {
        add_header Cache-Control "public, max-age=0, must-revalidate" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        try_files $uri $uri.html $uri/index.html /index.html;
    }

    error_page 404 /+not-found.html;
    location = /+not-found.html {
        internal;
        add_header Cache-Control "public, max-age=0, must-revalidate" always;
    }
}
EOF

# Copy compiled static web bundle and pre-compressed .gz assets from builder phase
COPY --link --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
