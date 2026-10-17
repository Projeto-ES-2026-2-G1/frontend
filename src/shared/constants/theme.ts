export const Colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

/**
 * Paleta do produto (as variáveis do `base.css` do site original:
 * verde-escuro, verde-claro, cinza-claro, etc).
 */
export const BrandColors = {
  darkGreen: '#00412E',
  greenHover: '#02553C',
  lightGreen: '#97BF8A',
  lightGray: '#E8EAE5',
  white: '#FFFFFF',
  text: '#0E2A20',
  textSoft: '#5B6660',
  border: '#C9CEC6',
  toPayBg: '#F4DEDC',
  toPayText: '#8C2B2B',
  toReceiveBg: '#DCEBD6',
  toReceiveText: '#1F5A3A',
} as const;

/**
 * Famílias de fonte carregadas no layout raiz (src/app/_layout.tsx),
 * equivalentes às fontes Google do site: Outfit (títulos) e DM Sans (corpo).
 */
export const FontFamily = {
  titleMedium: 'Outfit_500Medium',
  title: 'Outfit_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

/**
 * Quebras de layout do site original, em px:
 * 900px (painéis do login empilham), 800px e 1100px (grid do dashboard).
 */
export const Breakpoints = {
  loginStacked: 900,
  dashboardCompact: 800,
  dashboardMedium: 1100,
} as const;
