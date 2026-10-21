import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import type { FinancialContext } from '../../types';

const CONTEXT_OPTIONS: { value: FinancialContext; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'pessoal', label: 'Pessoal' },
];

export interface ContextSelectorProps {
  value: FinancialContext;
  onChange: (value: FinancialContext) => void;
}

/**
 * Seletor de contexto (Todos / Empresa / Pessoal) do topo do dashboard
 * (`.contexto` no dashboard.css). Somos o grupo com `role="group"`
 * e `aria-label="Contexto dos valores"` no site.
 */
export function ContextSelector({ value, onChange }: ContextSelectorProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Contexto dos valores"
      style={styles.group}
    >
      {CONTEXT_OPTIONS.map(({ value: optionValue, label }) => {
        const isActive = optionValue === value;
        return (
          <Pressable
            key={optionValue}
            style={({ pressed }) => [
              styles.option,
              isActive && styles.optionActive,
              pressed && !isActive && styles.optionPressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(optionValue)}
          >
            <Text
              style={[
                styles.optionText,
                isActive ? styles.optionTextActive : styles.optionTextInactive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    padding: 3,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    borderRadius: 12,
    backgroundColor: BrandColors.white,
  },
  option: {
    height: 34,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  optionActive: {
    backgroundColor: BrandColors.darkGreen,
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionText: {
    fontFamily: FontFamily.body,
    fontSize: 14,
  },
  optionTextInactive: {
    // Até o hover, o site usa font-weight 500 nesta cor.
    fontFamily: FontFamily.bodyMedium,
    color: BrandColors.textSoft,
  },
  optionTextActive: {
    fontFamily: FontFamily.bodyBold,
    color: BrandColors.white,
  },
});
