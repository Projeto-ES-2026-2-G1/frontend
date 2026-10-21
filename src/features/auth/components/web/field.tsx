import React, { forwardRef, useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import { EyeClosedIcon, EyeOpenIcon } from './icons';

export interface FieldProps extends TextInputProps {
  label: string;
  /** Campo de senha: exibe o botão do olho (mostrar / ocultar). */
  secure?: boolean;
}

/**
 * Campo de formulário, equivalente ao `.campo` / `.entrada` do site.
 * O anel verde de foco reproduz o `:focus-within` do CSS.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, secure = false, style, ...textInputProps },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, isFocused && styles.boxFocused]}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secure ? !isPasswordVisible : undefined}
          placeholderTextColor="rgba(91, 102, 96, 0.75)"
          {...textInputProps}
        />

        {secure && (
          <Pressable
            style={({ pressed }) => [styles.eyeButton, pressed && styles.eyeButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityState={{ selected: isPasswordVisible }}
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
  boxFocused: {
    borderColor: BrandColors.darkGreen,
    boxShadow: '0 0 0 3px rgba(151, 191, 138, 0.45)',
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
});
