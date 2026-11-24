/** Handle comum dos cards da tela de acesso: foca o primeiro campo. */
export interface AuthCardHandle {
  focusFirstField(): void;
}

/** Card atualmente visível na tela de acesso web. */
export type AuthCardActive = 'login' | 'cadastro' | 'recuperar' | 'redefinir';

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}

export interface PasswordRecoveryResult {
  message: string;
  /**
   * Token de demonstração retornado apenas no modo local (quando o backend
   * ainda não está configurado via `EXPO_PUBLIC_API_URL`), permitindo testar
   * o fluxo completo de redefinição na interface web.
   */
  demoToken?: string;
}

export interface PasswordRecoveryAdapter {
  requestPasswordRecovery(
    data: PasswordRecoveryRequest
  ): Promise<PasswordRecoveryResult>;
  resetPassword(data: PasswordResetRequest): Promise<PasswordRecoveryResult>;
}

export interface PasswordRecoveryErrors {
  email?: string;
}

export interface PasswordResetErrors {
  token?: string;
  password?: string;
  confirmPassword?: string;
}
