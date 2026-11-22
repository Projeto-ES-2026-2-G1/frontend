import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Logo, LogoText, PrimaryButton, TextField } from '@shared/components';
import { colors, FontFamily, radius, shadow } from '@shared/constants';
import { logIn } from '../../service';

export interface LoginScreenMobileProps {
  onLogin?: (login: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const MIN_PASSWORD_LENGTH = 8;

export function LoginScreenMobile({
  onLogin,
  onForgotPassword,
}: LoginScreenMobileProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = login.trim().length > 0 && password.length >= MIN_PASSWORD_LENGTH;

  function handleLogin() {
    if (onLogin) {
      onLogin(login, password);
    } else {
      logIn();
      router.replace('/dashboard');
    }
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
          <View style={styles.headerColumn}>
            <Logo size={90} />
            <LogoText size={32} style={{ marginTop: 12 }} />
            <Text style={styles.tagline}>Seu financeiro na palma da mão.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta com CPF, CNPJ ou e-mail.
            </Text>

            <TextField
              label="CPF, CNPJ ou e-mail"
              placeholder="000.000.000-00"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.loginInput}
            />

            <TextField
              label="Senha"
              placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureToggle
            />

            <TouchableOpacity style={styles.forgot} onPress={() => (onForgotPassword ? onForgotPassword() : router.push('/recuperar-senha'))} accessibilityRole="button" accessibilityLabel="Esqueci minha senha">
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <PrimaryButton title="Entrar" onPress={handleLogin} disabled={!canSubmit} />

            <Text style={styles.signup}>
              Não tem uma conta?{' '}
              <Text style={styles.signupLink} onPress={() => router.push('/cadastro')}>
                Criar conta
              </Text>
            </Text>
          </View>

          <View style={styles.secure}>
            <Feather name="lock" size={13} color={colors.textMuted} />
            <Text style={styles.secureText}>Seus dados estão seguros.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreenMobile;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerColumn: { alignItems: 'center', marginBottom: 24 },
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
  title: { fontFamily: FontFamily.title, fontSize: 32, color: colors.primary },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
    marginBottom: 24,
  },
  loginInput: { fontSize: 16 },
  // O TextField já deixa 20 de espaço embaixo; o -4 mantém os 16 de antes.
  forgot: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 20 },
  forgotText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: colors.primary,
  },
  signup: {
    fontFamily: FontFamily.body,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: colors.textMuted,
  },
  signupLink: { fontFamily: FontFamily.bodyBold, color: colors.primary },
  secure: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },
  secureText: { fontFamily: FontFamily.body, fontSize: 11, color: colors.textMuted },
});