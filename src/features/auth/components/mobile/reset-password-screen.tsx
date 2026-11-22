
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import {
  Logo,
  LogoText,
  PrimaryButton,
  TextField,
} from '@shared/components';

import {
  colors,
  FontFamily,
  radius,
  shadow,
} from '@shared/constants';

import {
  validatePasswordReset,
} from '../../validation/password-recovery.validation';

import {
  resetPassword,
} from '../../service/password-recovery.service';

export function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setPasswordError('');
    setConfirmPasswordError('');
    setServiceError('');
    setSuccessMessage('');

    const errors = validatePasswordReset(
      password,
      confirmPassword
    );

    if (errors.password || errors.confirmPassword) {
      setPasswordError(errors.password ?? '');
      setConfirmPasswordError(errors.confirmPassword ?? '');
      return;
    }

    if (!token || typeof token !== 'string') {
      setServiceError(
        'Código de recuperação inválido. Solicite uma nova recuperação de senha.'
      );
      return;
    }

    try {
      setLoading(true);

      const result = await resetPassword(token, password);

      setSuccessMessage(result.message);

      // Retorna ao login somente após sucesso confirmado.
      router.replace('/login');
    } catch (error) {
      setServiceError(
        error instanceof Error
          ? error.message
          : 'Não foi possível redefinir sua senha. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBackToLogin() {
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Logo size={80} />
            <LogoText size={30} style={{ marginTop: 10 }} />
            <Text style={styles.tagline}>
              Seu financeiro na palma da mão.
            </Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
              accessibilityRole="button"
              accessibilityLabel="Voltar para o login"
              disabled={loading}
            >
              <Feather
                name="arrow-left"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.backText}>
                Voltar para o login
              </Text>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Feather
                name="lock"
                size={30}
                color={colors.primary}
              />
            </View>

            <Text style={styles.title}>
              Redefinir senha
            </Text>

            <Text style={styles.subtitle}>
              Crie uma nova senha para acessar sua conta.
            </Text>

            <TextField
              label="Nova senha"
              placeholder="Mínimo de 8 caracteres"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setPasswordError('');
                setServiceError('');
                setSuccessMessage('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              secureToggle
            />

            <TextField
              label="Confirmar nova senha"
              placeholder="Digite novamente sua senha"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setConfirmPasswordError('');
                setServiceError('');
                setSuccessMessage('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              secureToggle
              error={confirmPasswordError}
            />

            {passwordError ? (
              <Text style={styles.passwordError}>
                {passwordError}
              </Text>
            ) : null}

            {serviceError ? (
              <View style={styles.errorContainer}>
                <Feather
                  name="alert-circle"
                  size={18}
                  color={colors.danger}
                />
                <Text style={styles.errorMessage}>
                  {serviceError}
                </Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successContainer}>
                <Feather
                  name="check-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.successMessage}>
                  {successMessage}
                </Text>
              </View>
            ) : null}

            <PrimaryButton
              title="Salvar nova senha"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />

            <Text style={styles.footer}>
              Lembrou sua senha?{' '}
              <Text
                style={styles.loginLink}
                onPress={handleBackToLogin}
              >
                Entrar
              </Text>
            </Text>
          </View>

          <View style={styles.secure}>
            <Feather
              name="shield"
              size={14}
              color={colors.textMuted}
            />
            <Text style={styles.secureText}>
              Seus dados estão seguros.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  tagline: {
    marginTop: 8,
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: colors.textMuted,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 24,
    ...shadow,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },

  backText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: colors.primary,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    fontFamily: FontFamily.title,
    fontSize: 28,
    color: colors.primary,
  },

  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 21,
  },

  passwordError: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: colors.danger,
    marginTop: -12,
    marginBottom: 16,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.dangerTint,
    padding: 12,
    borderRadius: radius.md,
    marginBottom: 18,
    gap: 8,
  },

  errorMessage: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: colors.danger,
    lineHeight: 18,
  },

  successContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryTint,
    padding: 12,
    borderRadius: radius.md,
    marginBottom: 18,
    gap: 8,
  },

  successMessage: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: colors.success,
    lineHeight: 18,
  },

  footer: {
    fontFamily: FontFamily.body,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: colors.textMuted,
  },

  loginLink: {
    fontFamily: FontFamily.bodyBold,
    color: colors.primary,
  },

  secure: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },

  secureText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    color: colors.textMuted,
  },
});
