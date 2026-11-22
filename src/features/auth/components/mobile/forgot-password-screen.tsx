
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
import { router } from 'expo-router';

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
  validateRecoveryEmail,
} from '../../validation/password-recovery.validation';

import {
  requestPasswordRecovery,
} from '../../service/password-recovery.service';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setEmailError('');
    setServiceError('');
    setSuccessMessage('');

    const errors = validateRecoveryEmail(email);

    if (errors.email) {
      setEmailError(errors.email);
      return;
    }

    try {
      setLoading(true);

      const result = await requestPasswordRecovery(email);

      setSuccessMessage(
        result.message || 'Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.'
      );
    } catch (error) {
      setServiceError(
        error instanceof Error
          ? error.message
          : 'Não foi possível solicitar a recuperação de senha. Tente novamente mais tarde.'
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
              Recuperar senha
            </Text>

            <Text style={styles.subtitle}>
              Informe seu e-mail cadastrado para receber as instruções de recuperação de senha.
            </Text>

            <TextField
              label="E-mail"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError('');
                setServiceError('');
                setSuccessMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
            />

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
              title="Enviar instruções"
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

export default ForgotPasswordScreen;

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
