import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import { requestPasswordRecovery } from '../../service';
import type { AuthCardHandle, PasswordRecoveryErrors } from '../../types';
import { hasValidationErrors, validateRecoveryEmail } from '../../validation';
import {
  ActionLink,
  AuthCard,
  FeedbackBanner,
  PrimaryButton,
} from './auth-card';
import { Field } from './field';

export interface ForgotPasswordCardProps {
  onBackToLogin: () => void;
  onProceedToReset?: (token?: string) => void;
}

/**
 * Card "Recuperar senha" (Página 4 do protótipo — solicitação por e-mail).
 */
export const ForgotPasswordCard = forwardRef<
  AuthCardHandle,
  ForgotPasswordCardProps
>(function ForgotPasswordCard({ onBackToLogin, onProceedToReset }, ref) {
  const emailRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<PasswordRecoveryErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      focusFirstField: () => emailRef.current?.focus(),
    }),
    []
  );

  function handleEmailChange(value: string) {
    setEmail(value);
    if (errors.email) {
      setErrors({});
    }
    if (apiError) {
      setApiError(null);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    const validationErrors = validateRecoveryEmail(email);
    setErrors(validationErrors);
    setApiError(null);
    setSuccessMessage(null);
    setDemoToken(null);

    if (hasValidationErrors(validationErrors)) {
      emailRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestPasswordRecovery(email);
      setSuccessMessage(result.message);
      setDemoToken(result.demoToken ?? null);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar as instruções. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Recuperar senha"
      subtitle="Informe o e-mail da sua conta para receber as instruções de redefinição."
    >
      {apiError ? <FeedbackBanner variant="error" message={apiError} /> : null}

      {successMessage ? (
        <FeedbackBanner
          variant="success"
          title="Instruções enviadas"
          message={successMessage}
        >
          {demoToken && onProceedToReset ? (
            <View style={styles.demoBox}>
              <Text style={styles.demoHint}>
                Ambiente sem back-end configurado — código gerado para teste:{' '}
                <Text style={styles.demoToken}>{demoToken}</Text>
              </Text>
              <ActionLink onPress={() => onProceedToReset(demoToken)}>
                Continuar para redefinição de senha
              </ActionLink>
            </View>
          ) : null}
        </FeedbackBanner>
      ) : null}

      <Field
        ref={emailRef}
        label="E-mail"
        value={email}
        onChangeText={handleEmailChange}
        placeholder="voce@empresa.com"
        inputMode="email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        returnKeyType="send"
        editable={!isSubmitting}
        error={errors.email}
        onSubmitEditing={handleSubmit}
      />

      <PrimaryButton
        onPress={handleSubmit}
        loading={isSubmitting}
        loadingLabel="Enviando..."
      >
        Enviar instruções
      </PrimaryButton>

      <View style={styles.footerLinks}>
        {onProceedToReset ? (
          <ActionLink
            center
            disabled={isSubmitting}
            onPress={() => onProceedToReset(demoToken ?? undefined)}
          >
            Já tenho um código de recuperação
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
  demoBox: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 90, 58, 0.2)',
    gap: 6,
  },
  demoHint: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.toReceiveText,
  },
  demoToken: {
    fontFamily: FontFamily.bodyBold,
    color: BrandColors.darkGreen,
  },
  footerLinks: {
    gap: 12,
    alignItems: 'center',
  },
});
