import type React from 'react';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BrandColors, FontFamily } from '@shared';

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Estrutura comum dos cards de acesso (Entrar, Criar conta, Recuperar e Redefinir senha).
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
  disabled?: boolean;
  onPress?: () => void;
}

/** `.link-acao`: links "Esqueci minha senha", "Criar conta", "Entrar" e retorno. */
export function ActionLink({
  children,
  center,
  disabled = false,
  onPress,
}: ActionLinkProps) {
  return (
    <Pressable
      style={[
        authCardStyles.actionLink,
        center && authCardStyles.actionLinkCenter,
        disabled && authCardStyles.actionLinkDisabled,
      ]}
      accessibilityRole="link"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Text
          style={[
            authCardStyles.actionLinkText,
            pressed && !disabled && authCardStyles.actionLinkPressed,
          ]}
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
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

/** `.botao` da tela de acesso (altura 55px, fonte Outfit, suporte a carregamento). */
export function PrimaryButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  loadingLabel,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        authCardStyles.button,
        isDisabled && authCardStyles.buttonDisabled,
        // Equivalente ao `.botao:hover` do site.
        pressed && !isDisabled && { backgroundColor: BrandColors.greenHover },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
    >
      <View style={authCardStyles.buttonContent}>
        {loading && (
          <ActivityIndicator size="small" color={BrandColors.white} />
        )}
        <Text style={authCardStyles.buttonText}>
          {loading && loadingLabel ? loadingLabel : children}
        </Text>
      </View>
    </Pressable>
  );
}

export interface FeedbackBannerProps {
  variant: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  children?: ReactNode;
}

/** Aviso visual de confirmação, erro ou instrução dentro dos cards de acesso. */
export function FeedbackBanner({
  variant,
  title,
  message,
  children,
}: FeedbackBannerProps) {
  const containerStyle =
    variant === 'success'
      ? authCardStyles.bannerSuccess
      : variant === 'error'
        ? authCardStyles.bannerError
        : authCardStyles.bannerInfo;

  const textStyle =
    variant === 'success'
      ? authCardStyles.bannerSuccessText
      : variant === 'error'
        ? authCardStyles.bannerErrorText
        : authCardStyles.bannerInfoText;

  return (
    <View style={[authCardStyles.banner, containerStyle]} accessibilityRole="alert">
      {title ? (
        <Text style={[authCardStyles.bannerTitle, textStyle]}>{title}</Text>
      ) : null}
      <Text style={[authCardStyles.bannerMessage, textStyle]}>{message}</Text>
      {children}
    </View>
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
 * Exportados para os cards de acesso montarem os campos.
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
    lineHeight: 22,
    color: BrandColors.textSoft,
  },
  form: {
    marginTop: 22,
    gap: 20,
  },
  actionLink: {
    alignSelf: 'flex-start',
  },
  actionLinkCenter: {
    alignSelf: 'center',
  },
  actionLinkDisabled: {
    opacity: 0.5,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    fontFamily: FontFamily.title,
    fontSize: 20,
    color: BrandColors.white,
  },
  banner: {
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  bannerSuccess: {
    backgroundColor: BrandColors.toReceiveBg,
  },
  bannerError: {
    backgroundColor: BrandColors.toPayBg,
  },
  bannerInfo: {
    backgroundColor: BrandColors.lightGray,
  },
  bannerTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  bannerMessage: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
  },
  bannerSuccessText: {
    color: BrandColors.toReceiveText,
  },
  bannerErrorText: {
    color: BrandColors.toPayText,
  },
  bannerInfoText: {
    color: BrandColors.darkGreen,
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
