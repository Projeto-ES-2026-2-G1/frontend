import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Logo, LogoText } from '@shared/components';
import { colors, radius, shadow } from '@shared';
import { logIn } from '../../service';

export interface LoginScreenMobileProps {
  onLogin?: (login: string, password: string) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export function LoginScreenMobile({
  onLogin,
  onForgotPassword,
  onSignUp,
}: LoginScreenMobileProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = login.trim().length > 0 && password.length >= 8;

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
        style={{ flex: 1 }}
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

            <Text style={styles.label}>CPF, CNPJ ou e-mail</Text>
            <TextInput
              style={styles.input}
              value={login}
              onChangeText={setLogin}
              placeholder="000.000.000-00"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo de 8 caracteres"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={10}
              >
                <Text style={styles.showText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgot} onPress={onForgotPassword}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !canSubmit && { opacity: 0.6 }]}
              disabled={!canSubmit}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.signup}>
              Não tem uma conta?{' '}
              <Text style={styles.signupLink} onPress={onSignUp}>
                Cadastre-se
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
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerColumn: { alignItems: 'center', marginBottom: 24 },
  tagline: { marginTop: 8, fontSize: 13, color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 24,
    ...shadow,
  },
  title: { fontSize: 32, fontWeight: '800', color: colors.primary },
  subtitle: {
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  passwordWrapper: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: { flex: 1, fontSize: 14, color: colors.text },
  showText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  forgot: { alignSelf: 'flex-end', marginTop: 16, marginBottom: 20 },
  forgotText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  button: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  signup: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: colors.textMuted,
  },
  signupLink: { fontWeight: '700', color: colors.primary },
  secure: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },
  secureText: { fontSize: 11, color: colors.textMuted },
});
