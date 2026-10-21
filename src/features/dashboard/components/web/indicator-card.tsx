import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';

export interface IndicatorCardProps {
  label: string;
  value: string;
  note: string;
  /** `.indicador--escuro` e `.indicador--claro` do dashboard.css. */
  variant?: 'default' | 'dark' | 'light';
}

/**
 * Cartão de indicador do resumo (`.indicador`).
 * Tipografia e cores transcritas do dashboard.css — sem mudanças visuais.
 */
export function IndicatorCard({
  label,
  value,
  note,
  variant = 'default',
}: IndicatorCardProps) {
  const palette = VARIANTS[variant];

  return (
    <View style={[styles.card, { backgroundColor: palette.background }]}>
      <Text style={[styles.label, { color: palette.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: palette.value }]}>{value}</Text>
      <Text style={[styles.note, { color: palette.muted }]}>{note}</Text>
    </View>
  );
}

const VARIANTS: Record<
  Exclude<IndicatorCardProps['variant'], undefined>,
  { background: string; value: string; muted: string }
> = {
  default: {
    background: BrandColors.white,
    value: BrandColors.text,
    muted: BrandColors.textSoft,
  },
  dark: {
    background: BrandColors.darkGreen,
    value: BrandColors.white,
    muted: 'rgba(232, 234, 229, 0.85)',
  },
  light: {
    background: BrandColors.lightGreen,
    value: BrandColors.text,
    muted: 'rgba(14, 42, 32, 0.78)',
  },
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    minHeight: 132,
    padding: 21,
    borderRadius: 18,
    gap: 9,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: 14,
  },
  value: {
    fontFamily: FontFamily.title,
    fontSize: 29,
    lineHeight: 29 * 1.25,
  },
  note: {
    fontFamily: FontFamily.body,
    fontSize: 13,
  },
});
