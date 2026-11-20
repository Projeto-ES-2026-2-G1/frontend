import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors, FontFamily, radius } from '../../constants/theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /** Campos de senha: esconde o texto e mostra o botão Mostrar/Ocultar. */
  secureToggle?: boolean;
};

export function TextField({
  label,
  error,
  secureToggle,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
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
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureToggle ? hidden : inputProps.secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={label}
        />
        {secureToggle && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Text style={styles.toggle}>{hidden ? 'Mostrar' : 'Ocultar'}</Text>
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 20 },
  label: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: colors.primary,
    marginBottom: 10,
  },
  inputWrap: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  inputWrapFocused: { borderColor: colors.primary },
  inputWrapError: { borderColor: colors.danger, backgroundColor: colors.dangerTint },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: colors.text,
  },
  toggle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: colors.primary,
    marginLeft: 8,
  },
  errorText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: colors.danger,
    marginTop: 6,
  },
});