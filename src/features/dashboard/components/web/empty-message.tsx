import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { BrandColors, FontFamily } from '@shared';

/**
 * Mensagem de "ainda não há dados" (`.vazio` no dashboard.css),
 * usada nos vencimentos, lançamentos e categorias.
 */
export function EmptyMessage({
  children,
  style,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.empty, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 28,
    paddingHorizontal: 8,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: BrandColors.textSoft,
    textAlign: 'center',
  },
});
