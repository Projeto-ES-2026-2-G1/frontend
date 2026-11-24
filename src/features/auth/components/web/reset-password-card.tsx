import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { TextInput } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { resetPassword } from '../../service';
import type { AuthCardHandle, PasswordResetErrors } from '../../types';
import {
  hasValidationErrors,
  MIN_PASSWORD_LENGTH,
  validatePasswordReset,
} from '../../validation';
import {
  ActionLink,
  AuthCard,
  FeedbackBanner,
  PrimaryButton,
} from './auth-card';
import { Field } from './field';

export interface ResetPasswordCardProps {
  /** Token recebido por link (`?token=...`) ou fluxo de recuperação. */
  initialToken?: string;
  onBackToLogin: () => void;
  onRequestNewLink?: () => void;
  onResetSuccess: (message: string) => void;
}

/**
 * Card "Redefinir senha" (Página 4 do protótipo — redefinição via link ou token).
 */
export const ResetPasswordCard = forwardRef<
  AuthCardHandle,
  ResetPasswordCardProps
>(function ResetPasswordCard(
  { initialToken, onBackToLogin, onRequestNewLink, onResetSuccess },
  ref
) {
  const tokenRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const normalizedInitialToken = initialToken?.trim() ?? '';
  const hasTokenFromLink = Boolean(normalizedInitialToken);

  const [token, setToken] = useState(normalizedInitialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<PasswordResetErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (normalizedInitialToken) {
      setToken(normalizedInitialToken);
      setErrors((prev) => ({ ...prev, token: undefined }));
    }
  }, [normalizedInitialToken]);

  useImperativeHandle(
    ref,
    () => ({
      focusFirstField: () => {
        if (!hasTokenFromLink) {
          tokenRef.current?.focus();
          return;
        }
        passwordRef.current?.focus();
      },
    }),
    [hasTokenFromLink]
  );

  function handleTokenChange(value: string) {
    setToken(value);
    if (errors.token) {
      setErrors((prev) => ({ ...prev, token: undefined }));
    }
    if (apiError) {
      setApiError(null);
    }
  }

  function handlePasswordChange(value: string) {
    setNewPassword(value);
    if (errors.password || errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
        confirmPassword: undefined,
      }));
    }
    if (apiError) {
      setApiError(null);
    }
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    if (apiError) {
      setApiError(null);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    const effectiveToken = hasTokenFromLink ? normalizedInitialToken : token;
    const validationErrors = validatePasswordReset(
      newPassword,
      confirmPassword,
      effectiveToken,
      true
    );

    setErrors(validationErrors);
    setApiError(null);

    if (hasValidationErrors(validationErrors)) {
      if (validationErrors.token && !hasTokenFromLink) {
        tokenRef.current?.focus();
      } else if (validationErrors.password) {
        passwordRef.current?.focus();
      } else if (validationErrors.confirmPassword) {
        confirmPasswordRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword(effectiveToken, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      onResetSuccess(
        result.message || 'Senha redefinida com sucesso. Faça login para continuar.'
      );
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar a nova senha. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Redefinir senha"
      subtitle="Crie uma nova senha segura para voltar a acessar sua conta."
    >
      {apiError ? (
        <FeedbackBanner variant="error" message={apiError}>
          {onRequestNewLink ? (
            <View style={styles.bannerAction}>
              <ActionLink disabled={isSubmitting} onPress={onRequestNewLink}>
                Solicitar novo link de recuperação
              </ActionLink>
            </View>
          ) : null}
        </FeedbackBanner>
      ) : null}

      {hasTokenFromLink ? (
        <FeedbackBanner
          variant="info"
          message="Link de recuperação validado. Informe e confirme sua nova senha abaixo."
        />
      ) : (
        <Field
          ref={tokenRef}
          label="Código de recuperação"
          value={token}
          onChangeText={handleTokenChange}
          placeholder="Cole o código recebido por e-mail"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          editable={!isSubmitting}
          error={errors.token}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
      )}

      <Field
        ref={passwordRef}
        label="Nova senha"
        value={newPassword}
        onChangeText={handlePasswordChange}
        placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
        secure
        autoComplete="new-password"
        returnKeyType="next"
        editable={!isSubmitting}
        error={errors.password}
        helperText={`Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      <Field
        ref={confirmPasswordRef}
        label="Confirmar nova senha"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        placeholder="Repita a nova senha"
        secure
        autoComplete="new-password"
        returnKeyType="done"
        editable={!isSubmitting}
        error={errors.confirmPassword}
        onSubmitEditing={handleSubmit}
      />

      <PrimaryButton
        onPress={handleSubmit}
        loading={isSubmitting}
        loadingLabel="Salvando..."
      >
        Salvar nova senha
      </PrimaryButton>

      <View style={styles.footerLinks}>
        {onRequestNewLink && !hasTokenFromLink ? (
          <ActionLink center disabled={isSubmitting} onPress={onRequestNewLink}>
            Não recebi o código
          </ActionLink>
        ) : null}

        <ActionLink center disabled={isSubmitting} onPress={onBackToLogin}>
          Voltar para o login
        </ActionLink>
      </View>
    </AuthCard>
  );
});

const styles = StyleSheet.create({
  bannerAction: {
    marginTop: 4,
  },
  footerLinks: {
    gap: 12,
    alignItems: 'center',
  },
});
