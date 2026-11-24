import { isAxiosError } from 'axios';
import { apiClient } from '@shared/api';
import type {
  PasswordRecoveryAdapter,
  PasswordRecoveryRequest,
  PasswordRecoveryResult,
  PasswordResetRequest,
} from '../types';
import { MIN_PASSWORD_LENGTH } from '../validation/password-recovery.validation';

const LOCAL_STORAGE_TOKEN_KEY = 'simplimei:password-recovery:last-token';
const SIMULATED_DELAY_MS = 450;

let customAdapter: PasswordRecoveryAdapter | null = null;
let lastLocalToken: string | null = null;

function getApiBaseUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/+$/, '');
}

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined;

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }

    if (typeof data?.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }

    if (error.response?.status === 400 || error.response?.status === 422) {
      return 'Verifique os dados informados e tente novamente.';
    }

    if (error.response?.status === 404 || error.response?.status === 410) {
      return 'Link ou código de recuperação inválido ou expirado.';
    }

    if (error.code === 'ECONNABORTED' || !error.response) {
      return 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}

function createHttpAdapter(baseUrl: string): PasswordRecoveryAdapter {
  return {
    async requestPasswordRecovery(
      data: PasswordRecoveryRequest
    ): Promise<PasswordRecoveryResult> {
      try {
        const response = await apiClient.post<{ message?: string }>(
          `${baseUrl}/auth/forgot-password`,
          { email: data.email }
        );
        return {
          message:
            response.data?.message?.trim() ||
            'Instruções de recuperação enviadas para o seu e-mail.',
        };
      } catch (error) {
        throw new Error(
          extractApiErrorMessage(
            error,
            'Não foi possível enviar as instruções de recuperação.'
          )
        );
      }
    },

    async resetPassword(
      data: PasswordResetRequest
    ): Promise<PasswordRecoveryResult> {
      try {
        const response = await apiClient.post<{ message?: string }>(
          `${baseUrl}/auth/reset-password`,
          {
            token: data.token,
            newPassword: data.newPassword,
          }
        );
        return {
          message:
            response.data?.message?.trim() ||
            'Sua senha foi redefinida com sucesso.',
        };
      } catch (error) {
        throw new Error(
          extractApiErrorMessage(
            error,
            'Não foi possível redefinir sua senha. Solicite um novo link.'
          )
        );
      }
    },
  };
}

function saveLocalDemoToken(token: string): void {
  lastLocalToken = token;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    } catch {
      // Ignora indisponibilidade de sessionStorage em ambientes restritos.
    }
  }
}

function clearLocalDemoToken(): void {
  lastLocalToken = null;
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    } catch {
      // Ignora indisponibilidade de sessionStorage em ambientes restritos.
    }
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateLocalDemoToken(): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REC-${suffix}`;
}

/**
 * Fallback local utilizado enquanto as rotas de recuperação de senha ainda não
 * estão disponíveis no back-end (sem `EXPO_PUBLIC_API_URL` nem adaptador customizado).
 */
const localFallbackAdapter: PasswordRecoveryAdapter = {
  async requestPasswordRecovery(
    data: PasswordRecoveryRequest
  ): Promise<PasswordRecoveryResult> {
    await wait(SIMULATED_DELAY_MS);

    const demoToken = generateLocalDemoToken();
    saveLocalDemoToken(demoToken);

    return {
      message: `Se existir uma conta associada a ${data.email}, enviamos as instruções para redefinir sua senha.`,
      demoToken,
    };
  },

  async resetPassword(
    data: PasswordResetRequest
  ): Promise<PasswordRecoveryResult> {
    await wait(SIMULATED_DELAY_MS);

    const normalizedToken = data.token.trim();
    if (
      !normalizedToken ||
      normalizedToken.length < 4 ||
      normalizedToken.toLowerCase() === 'invalido' ||
      normalizedToken.toLowerCase() === 'expirado'
    ) {
      throw new Error(
        'Link ou código de recuperação inválido ou expirado. Solicite novas instruções.'
      );
    }

    if (data.newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
      );
    }

    if (lastLocalToken && normalizedToken === lastLocalToken) {
      clearLocalDemoToken();
    }

    return {
      message: 'Sua senha foi redefinida com sucesso.',
    };
  },
};

function resolveAdapter(): PasswordRecoveryAdapter {
  if (customAdapter) {
    return customAdapter;
  }

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    return createHttpAdapter(baseUrl);
  }

  return localFallbackAdapter;
}

/**
 * Configura uma implementação customizada do adaptador de recuperação de senha
 * (útil para injeção da API real ou testes).
 */
export function configurePasswordRecoveryAdapter(
  implementation: PasswordRecoveryAdapter
): void {
  customAdapter = implementation;
}

/**
 * Remove o adaptador customizado, voltando à resolução padrão (API por env ou fallback local).
 */
export function clearPasswordRecoveryAdapter(): void {
  customAdapter = null;
}

/**
 * Indica se o serviço está operando contra uma API/adaptador configurado ou no modo local.
 */
export function isPasswordRecoveryApiConfigured(): boolean {
  return Boolean(customAdapter || getApiBaseUrl());
}

/**
 * Solicita o envio das instruções de recuperação de senha para o e-mail informado.
 */
export async function requestPasswordRecovery(
  email: string
): Promise<PasswordRecoveryResult> {
  return resolveAdapter().requestPasswordRecovery({
    email: email.trim().toLowerCase(),
  });
}

/**
 * Redefine a senha do usuário utilizando o token recebido via link ou código.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<PasswordRecoveryResult> {
  return resolveAdapter().resetPassword({
    token: token.trim(),
    newPassword,
  });
}
