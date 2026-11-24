import React, { forwardRef, useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import { EyeClosedIcon, EyeOpenIcon } from './icons';

export interface FieldProps extends TextInputProps {
  label: string;
  /** Campo de senha: exibe o botão do olho (mostrar / ocultar). */
  secure?: boolean;
  /** Mensagem de erro de validação exibida abaixo do campo. */
  error?: string;
  /** Texto auxiliar exibido quando não há erro. */
  helperText?: string;
}

/**
 * Campo de formulário, equivalente ao `.campo` / `.entrada` do site.
 * O anel verde de foco reproduz o `:focus-within` do CSS.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  {
    label,
    secure = false,
    error,
    helperText,
    editable = true,
    onFocus,
    onBlur,
    style,
    ...textInputProps
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.box,
          !editable && styles.boxDisabled,
          hasError && styles.boxError,
          isFocused && (hasError ? styles.boxErrorFocused : styles.boxFocused),
        ]}
      >
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          editable={editable}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          secureTextEntry={secure ? !isPasswordVisible : undefined}
          placeholderTextColor="rgba(91, 102, 96, 0.75)"
          {...textInputProps}
        />

        {secure && (
          <Pressable
            style={({ pressed }) => [
              styles.eyeButton,
              pressed && styles.eyeButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
            accessibilityState={{ selected: isPasswordVisible }}
            disabled={!editable}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
          >
            {/* Senha oculta = olho fechado; senha visível = olho aberto. */}
            {isPasswordVisible ? (
              <EyeOpenIcon color={BrandColors.darkGreen} />
            ) : (
              <EyeClosedIcon color={BrandColors.darkGreen} />
            )}
          </Pressable>
        )}
      </View>

      {hasError ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.text,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 53,
    flexGrow: 1,
    paddingHorizontal: 17,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    borderRadius: 14,
    backgroundColor: BrandColors.white,
  },
  boxDisabled: {
    backgroundColor: '#F3F5F2',
    opacity: 0.75,
  },
  boxFocused: {
    borderColor: BrandColors.darkGreen,
    boxShadow: '0 0 0 3px rgba(151, 191, 138, 0.45)',
  },
  boxError: {
    borderColor: BrandColors.toPayText,
  },
  boxErrorFocused: {
    borderColor: BrandColors.toPayText,
    boxShadow: '0 0 0 3px rgba(140, 43, 43, 0.2)',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: FontFamily.body,
    fontSize: 17,
    color: BrandColors.text,
    paddingVertical: 0,
  },
  eyeButton: {
    flexShrink: 0,
    width: 32,
    height: 32,
    marginRight: -6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  eyeButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.toPayText,
  },
  helperText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.textSoft,
  },
});
