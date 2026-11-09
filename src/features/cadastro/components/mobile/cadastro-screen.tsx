/**
 * SimpliMei — Tela de Cadastro (Expo / React Native / TypeScript)
 */
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { logIn } from '../../../auth/service';
import { Logo, LogoText } from '@shared/components';
import { colors, radius, shadow } from '@shared/constants';


/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */


const THEME = {
  colors: {
    background: "#E8EBE6",
    card: "#FFFFFF",
    primary: "#00402A",
    primaryDisabled: "#8FA89C",
    onPrimary: "#FFFFFF",
    label: "#1F5B3F",
    text: "#1A1A1A",
    textMuted: "#4A4A4A",
    placeholder: "#A6A6A6",
    border: "#DADDD8",
    borderFocus: "#00402A",
    error: "#C62828",
    errorBg: "#FDF3F3",
    shadow: "#000000",
  },
  spacing: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40 },
  radius: { input: 12, button: 12, card: 24, logo: 40 },
  sizes: { logo: 80, input: 58, button: 54, maxWidth: 390 },
  fonts: {
    title: "Outfit_600SemiBold",
    titleRegular: "Outfit_500Medium",
    regular: "DMSans_400Regular",
    medium: "DMSans_500Medium",
    bold: "DMSans_700Bold",
  },
  fontSize: { brand: 30, title: 32, body: 14, label: 13, input: 15, small: 12, button: 16 },
  minPasswordLength: 8,
} as const;

const C = colors;
const S = THEME.spacing;

/* ------------------------------------------------------------------ */
/* Reutilizáveis                                                       */
/* ------------------------------------------------------------------ */
type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  secureToggle?: boolean;
};

function TextField({ label, error, secureToggle, style, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          !!error && styles.inputWrapError,
        ]}
      >
        <TextInput
          {...inputProps}
          style={[styles.input, style]}
          placeholderTextColor={C.placeholder}
          secureTextEntry={secureToggle ? hidden : inputProps.secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          accessibilityLabel={label}
        />
        {secureToggle && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={S.xs}>
            <Text style={styles.toggle}>{hidden ? "Mostrar" : "Ocultar"}</Text>
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function PrimaryButton({ title, onPress, disabled, loading }: PrimaryButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        disabled && !loading && styles.buttonDisabled,
        pressed && !inactive && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={C.surface} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Validação                                                           */
/* ------------------------------------------------------------------ */
type Form = { name: string; document: string; email: string; password: string; confirm: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Campo obrigatório.";
  if (!f.document.trim()) e.document = "Campo obrigatório.";
  if (!f.email.trim()) e.email = "Campo obrigatório.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Informe um e-mail válido.";
  if (!f.password) e.password = "Campo obrigatório.";
  else if (f.password.length < THEME.minPasswordLength)
    e.password = `A senha deve ter no mínimo ${THEME.minPasswordLength} caracteres.`;
  if (!f.confirm) e.confirm = "Campo obrigatório.";
  else if (f.confirm !== f.password) e.confirm = "As senhas não coincidem.";
  return e;
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */
export type CadastroScreenMobileProps = { onGoToLogin?: () => void; onSuccess?: () => void;};

export function CadastroScreenMobile({ onGoToLogin, onSuccess }: CadastroScreenMobileProps) {

  const [form, setForm] = useState<Form>({ name: "", document: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => validate(form), [form]);
  const isEmpty = Object.values(form).some((v) => !v.trim());
  const showError = (k: keyof Form) => (submitted || touched[k] ? errors[k] : undefined);

  const set = (k: keyof Form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));
  const blur = (k: keyof Form) => () => setTouched((p) => ({ ...p, [k]: true }));

  const onSubmit = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      // TODO: integrar com o backend (criar conta) usando `form`.
      await new Promise((r) => setTimeout(r, 1500));
      logIn();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* <View style={styles.header}>
            <Image
              source={require("../../../../../assets/images/logo-simplimei.png")}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="SimpleMEI"
            />
            <Text style={styles.brand}>
              <Text style={styles.brandBold}>Simpli</Text>MEI
            </Text> */}
          <View style={styles.header}>
            <Logo />
            <LogoText />
            <Text style={styles.tagline}>Seu financeiro na palma da mão.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha os dados para começar a usar.</Text>

            <TextField
              label="Nome ou razão social"
              placeholder="Como você quer ser chamado"
              value={form.name}
              onChangeText={set("name")}
              onBlur={blur("name")}
              error={showError("name")}
              autoCapitalize="words"
            />
            <TextField
              label="CPF / CNPJ"
              placeholder="000.000.000-00"
              value={form.document}
              onChangeText={set("document")}
              onBlur={blur("document")}
              error={showError("document")}
              keyboardType="number-pad"
              style={styles.inputLarge}
            />
            <TextField
              label="E-mail"
              placeholder="voce@empresa.com"
              value={form.email}
              onChangeText={set("email")}
              onBlur={blur("email")}
              error={showError("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <TextField
              label="Senha"
              placeholder="Mínimo de 8 caracteres"
              value={form.password}
              onChangeText={set("password")}
              onBlur={blur("password")}
              error={showError("password")}
              secureToggle
              autoCapitalize="none"
            />
            <TextField
              label="Confirmar senha"
              placeholder="Repita sua senha"
              value={form.confirm}
              onChangeText={set("confirm")}
              onBlur={blur("confirm")}
              error={showError("confirm")}
              secureToggle
              autoCapitalize="none"
            />

            <PrimaryButton title="Criar conta" onPress={onSubmit} disabled={isEmpty} loading={loading} />

            <Text style={styles.footerText}>
              Já tem uma conta?{" "}
              <Text style={styles.link} onPress={onGoToLogin} accessibilityRole="link">
                Entrar
              </Text>
            </Text>
          </View>

          <View style={styles.secure}>
            <MaterialCommunityIcons name="lock-outline" size={14} color={C.textMuted} />
            <Text style={styles.secureText}>Seus dados estão seguros.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Estilos                                                             */
/* ------------------------------------------------------------------ */
const F = THEME.fonts;
const FS = THEME.fontSize;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: C.background },
  scroll: {
    flexGrow: 1,
    width: "100%",
    maxWidth: THEME.sizes.maxWidth,
    alignSelf: "center",
    paddingHorizontal: S.lg + S.xxs,
    paddingTop: S.xxl,
    paddingBottom: S.xl,
  },
  header: { alignItems: "center", marginBottom: S.xl },
  logo: {
    width: THEME.sizes.logo,
    height: THEME.sizes.logo,
    borderRadius: THEME.radius.logo,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: S.xs,
  },
  brand: { fontFamily: F.titleRegular, fontSize: FS.brand, color: C.primary },
  brandBold: { fontFamily: F.title },
  tagline: { fontFamily: F.regular, fontSize: FS.small + 1, color: C.textMuted, marginTop: S.xs },
  card: {
    backgroundColor: C.surface,
    borderRadius: radius.xl,
    paddingHorizontal: S.lg,
    paddingTop: S.lg + S.xxs,
    ...shadow,
    paddingBottom: S.lg + S.xxs,
    elevation: 3,
  },
  title: { fontFamily: F.title, fontSize: FS.title, color: C.primary },
  subtitle: { fontFamily: F.regular, fontSize: FS.body, color: C.primary, marginTop: S.xxs, marginBottom: S.lg + S.xxs },
  field: { marginBottom: S.lg - S.xxs },
  label: { fontFamily: F.bold, fontSize: FS.label - 1, color: C.primary, marginBottom: S.sm },
  inputWrap: {
    height: THEME.sizes.input,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: radius.md,
    paddingHorizontal: S.md - S.xxs,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
  },
  inputWrapFocused: { borderColor: C.primary },
  inputWrapError: { borderColor: C.danger, backgroundColor: C.dangerTint },
  input: { flex: 1, height: "100%", fontFamily: F.regular, fontSize: FS.body, color: C.text },
  inputLarge: { fontSize: FS.input + 2 },
  toggle: { fontFamily: F.bold, fontSize: FS.small, color: C.primary, marginLeft: S.xs },
  errorText: { fontFamily: F.medium, fontSize: FS.small, color: C.danger, marginTop: S.xxs + 2 },
  button: {
    height: THEME.sizes.button,
    borderRadius: radius.md,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: S.xxs,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.9 },
  buttonText: { fontFamily: F.bold, fontSize: FS.button, color: C.surface },
  footerText: { fontFamily: F.regular, fontSize: FS.label, color: C.text, textAlign: "center", marginTop: S.lg },
  link: { fontFamily: F.bold, color: C.primary },
  secure: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: S.xs - 2, marginTop: S.lg + S.xxs },
  secureText: { fontFamily: F.regular, fontSize: FS.small - 1, color: C.textMuted },
});