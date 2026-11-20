/**
 * SimpliMei — Tela de Cadastro (Expo / React Native / TypeScript)
 */
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { logIn } from '@features/auth/service';
import { Logo, LogoText, PrimaryButton, TextField } from '@shared/components';
import { colors, FontFamily, radius, shadow } from '@shared/constants';
import {
  MIN_PASSWORD_LENGTH,
  validateCadastro,
  type CadastroForm,
} from '../../validation';

export interface CadastroScreenMobileProps {
  onGoToLogin?: () => void;
  onSuccess?: () => void;
}

const INITIAL_FORM: CadastroForm = {
  name: '',
  email: '',
  telefone: '',
  CPF: '',
  nomeEmpresa: '',
  nomeFantasia: '',
  negocio: '',
  CNPJ: '',
  emailEmpresa: '',
  password: '',
  confirm: '',
};

export function CadastroScreenMobile({ onGoToLogin, onSuccess }: CadastroScreenMobileProps) {
  const [form, setForm] = useState<CadastroForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof CadastroForm, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => validateCadastro(form), [form]);
  const isEmpty = Object.values(form).some((v) => !v.trim());

  // Props em comum de todos os campos: valor, alteração, blur e erro.
  const bind = (key: keyof CadastroForm) => ({
    value: form[key],
    onChangeText: (v: string) => setForm((prev) => ({ ...prev, [key]: v })),
    onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
    error: submitted || touched[key] ? errors[key] : undefined,
  });

  async function handleSubmit() {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      // TODO: integrar com o backend (criar conta) usando `form`.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      logIn();
      onSuccess?.();
    } finally {
      setLoading(false);
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
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha os dados para começar a usar.</Text>

            <TextField
              label="Nome ou razão social"
              placeholder="Como você quer ser chamado"
              autoCapitalize="words"
              {...bind('name')}
            />
            <TextField
              label="E-mail"
              placeholder="voce@dominio.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              {...bind('email')}
            />
            <TextField
              label="Telefone (opcional)"
              placeholder="(83) 99999-9999"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              maxLength={15}
              {...bind('telefone')}
            />
            <TextField
              label="CPF (opcional)"
              placeholder="000.000.000-00"
              keyboardType="number-pad"
              style={styles.documentInput}
              {...bind('CPF')}
            />
            <TextField
              label="Nome da empresa"
              placeholder="Nome da primeira empresa"
              autoCapitalize="words"
              {...bind('nomeEmpresa')}
            />
            <TextField
              label="Nome fantasia da empresa (opcional)"
              placeholder="Nome fantasia da empresa"
              autoCapitalize="words"
              {...bind('nomeFantasia')}
            />
            <TextField
              label="Tipo de negócio (opcional)"
              placeholder="Tipo de negócio da empresa"
              autoCapitalize="words"
              {...bind('negocio')}
            />
            <TextField
              label="CNPJ (opcional)"
              placeholder="00.000.000/0000-00"
              keyboardType="number-pad"
              style={styles.documentInput}
              {...bind('CNPJ')}
            />
            <TextField
              label="E-mail da empresa"
              placeholder="empresa@dominio.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              {...bind('emailEmpresa')}
            />
            <TextField
              label="Senha"
              placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              autoCapitalize="none"
              secureToggle
              {...bind('password')}
            />
            <TextField
              label="Confirmar senha"
              placeholder="Repita sua senha"
              autoCapitalize="none"
              secureToggle
              {...bind('confirm')}
            />

            <PrimaryButton
              title="Criar conta"
              onPress={handleSubmit}
              disabled={isEmpty}
              loading={loading}
            />

            <Text style={styles.footerText}>
              Já tem uma conta?{' '}
              <Text style={styles.link} onPress={onGoToLogin} accessibilityRole="link">
                Entrar
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

export default CadastroScreenMobile;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
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
  documentInput: { fontSize: 16 },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
  link: { fontFamily: FontFamily.bodyBold, color: colors.primary },
  secure: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },
  secureText: { fontFamily: FontFamily.body, fontSize: 11, color: colors.textMuted },
});