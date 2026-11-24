import type { PasswordRecoveryErrors, PasswordResetErrors } from '../types';

export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida o e-mail informado na solicitação de recuperação de senha.
 */
export function validateRecoveryEmail(email: string): PasswordRecoveryErrors {
  const errors: PasswordRecoveryErrors = {};
  const normalized = email.trim();

  if (!normalized) {
    errors.email = 'Informe o e-mail cadastrado.';
  } else if (!EMAIL_REGEX.test(normalized)) {
    errors.email = 'Informe um e-mail válido.';
  }

  return errors;
}

/**
 * Valida os campos de redefinição de senha (token, nova senha e confirmação).
 */
export function validatePasswordReset(
  password: string,
  confirmPassword: string,
  token?: string,
  requireToken = false
): PasswordResetErrors {
  const errors: PasswordResetErrors = {};

  if (requireToken && !token?.trim()) {
    errors.token = 'Informe o código ou utilize o link de recuperação.';
  }

  if (!password) {
    errors.password = 'Informe a nova senha.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirme a nova senha.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
}

/**
 * Verifica se existe algum erro no objeto de validação.
 */
export function hasValidationErrors(
  errors: PasswordRecoveryErrors | PasswordResetErrors
): boolean {
  return Object.values(errors).some(Boolean);
}
