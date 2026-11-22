/**
 * Serviço compartilhado de recuperação e redefinição de senha.
 *
 * Este serviço pode ser utilizado pelas interfaces Mobile e Web.
 *
 * A implementação HTTP será conectada quando o backend
 * disponibilizar os endpoints correspondentes.
 */

export type PasswordRecoveryRequest = {
  email: string;
};

export type PasswordResetRequest = {
  token: string;
  newPassword: string;
};

export type PasswordRecoveryResult = {
  message: string;
};

export interface PasswordRecoveryAdapter {
  requestPasswordRecovery(
    data: PasswordRecoveryRequest
  ): Promise<PasswordRecoveryResult>;

  resetPassword(
    data: PasswordResetRequest
  ): Promise<PasswordRecoveryResult>;
}

/**
 * Adaptador da API.
 *
 * Permanece não configurado até a disponibilização do backend.
 */
let adapter: PasswordRecoveryAdapter | null = null;

/**
 * Configura a implementação que realizará as requisições HTTP.
 *
 * A mesma implementação poderá ser utilizada pelo Mobile e Web.
 */
export function configurePasswordRecoveryAdapter(
  implementation: PasswordRecoveryAdapter
): void {
  adapter = implementation;
}

/**
 * Remove a implementação configurada.
 */
export function clearPasswordRecoveryAdapter(): void {
  adapter = null;
}

/**
 * Solicita o envio das instruções de recuperação.
 */
export async function requestPasswordRecovery(
  email: string
): Promise<PasswordRecoveryResult> {
  if (!adapter) {
    throw new Error(
      'O serviço de recuperação de senha ainda não está configurado.'
    );
  }

  return adapter.requestPasswordRecovery({
    email: email.trim(),
  });
}

/**
 * Solicita a redefinição da senha utilizando o token recebido.
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<PasswordRecoveryResult> {
  if (!adapter) {
    throw new Error(
      'O serviço de redefinição de senha ainda não está configurado.'
    );
  }

  return adapter.resetPassword({
    token,
    newPassword,
  });
}
