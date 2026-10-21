import type React from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Estrutura comum dos cards "Entrar" e "Criar conta"
 * (título, subtítulo e `<form>` com espaçamento entre os campos).
 */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <>
      <Text style={authCardStyles.title}>{title}</Text>
      <Text style={authCardStyles.subtitle}>{subtitle}</Text>
      <View style={authCardStyles.form}>{children}</View>
    </>
  );
}

interface ActionLinkProps {
  children: string;
  center?: boolean;
  onPress?: () => void;
}

/** `.link-acao`: links "Esqueci minha senha", "Criar conta" e "Entrar". */
export function ActionLink({ children, center, onPress }: ActionLinkProps) {
  return (
    <Pressable
      style={[authCardStyles.actionLink, center && authCardStyles.actionLinkCenter]}
      accessibilityRole="link"
      onPress={onPress}
    >
      {({ pressed }) => (
        <Text
          style={[authCardStyles.actionLinkText, pressed && authCardStyles.actionLinkPressed]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

interface PrimaryButtonProps {
  children: string;
  onPress: () => void;
}

/** `.botao` da tela de login (altura 55px, fonte Outfit). */
export function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        authCardStyles.button,
        // Equivalente ao `.botao:hover` do site.
        pressed && { backgroundColor: BrandColors.greenHover },
      ]}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Text style={authCardStyles.buttonText}>{children}</Text>
    </Pressable>
  );
}

interface SwitchNoticeProps {
  notice: string;
  linkLabel: string;
  onSwitch: () => void;
}

/** Frases "Ainda não tem conta? Criar conta" / "Já tem conta? Entrar". */
export function SwitchNotice({ notice, linkLabel, onSwitch }: SwitchNoticeProps) {
  return (
    <Text style={authCardStyles.switchNotice}>
      {notice}{' '}
      <Text
        style={[authCardStyles.actionLinkText, authCardStyles.switchNoticeLink]}
        onPress={onSwitch}
      >
        {linkLabel}
      </Text>
    </Text>
  );
}

/**
 * Estilos compartilhados pelos cards (equivalentes ao login.css).
 * Exportados para os cards de login e de cadastro montarem os campos.
 */
export const authCardStyles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.title,
    fontSize: 34,
    lineHeight: 34 * 1.2,
    color: BrandColors.darkGreen,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: BrandColors.textSoft,
  },
  form: {
    marginTop: 22,
    gap: 22,
  },
  actionLink: {
    alignSelf: 'flex-start',
  },
  actionLinkCenter: {
    alignSelf: 'center',
  },
  actionLinkText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.darkGreen,
  },
  actionLinkPressed: {
    textDecorationLine: 'underline',
  },
  button: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: BrandColors.darkGreen,
  },
  buttonText: {
    fontFamily: FontFamily.title,
    fontSize: 20,
    color: BrandColors.white,
  },
  switchNotice: {
    alignSelf: 'center',
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: BrandColors.textSoft,
    textAlign: 'center',
  },
  switchNoticeLink: {
    marginLeft: 4,
  },
} as const);
