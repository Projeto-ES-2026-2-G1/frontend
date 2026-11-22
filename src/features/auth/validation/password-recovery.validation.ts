export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PasswordRecoveryErrors = {
  email?: string;
};

export type PasswordResetErrors = {
  password?: string;
  confirmPassword?: string;
};

/**
 * Valida o e-mail informado na solicitação de recuperação.
 */
export function validateRecoveryEmail(
  email: string
): PasswordRecoveryErrors {
  const errors: PasswordRecoveryErrors = {};

  if (!email.trim()) {
    errors.email = 'Campo obrigatório.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  return errors;
}

/**
 * Valida a nova senha e sua confirmação.
 */
export function validatePasswordReset(
  password: string,
  confirmPassword: string
): PasswordResetErrors {
  const errors: PasswordResetErrors = {};

  if (!password) {
    errors.password = 'Campo obrigatório.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password =
      `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Campo obrigatório.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
}

/**
 * Verifica se não existem erros na validação.
 */
export function hasValidationErrors(
  errors: PasswordRecoveryErrors | PasswordResetErrors
): boolean {
  return Object.keys(errors).length > 0;
}
