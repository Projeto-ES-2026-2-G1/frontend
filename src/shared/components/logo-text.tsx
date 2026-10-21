import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../constants';

export type LogoTextProps = {
  size?: number;
  style?: TextStyle;
};

export function LogoText({ size = 28, style }: LogoTextProps) {
  return (
    <Text style={[styles.base, { fontSize: size }, style]}>
      <Text style={styles.bold}>Simpli</Text>
      <Text style={styles.light}>Mei</Text>
    </Text>
  );
}

export default LogoText;

const styles = StyleSheet.create({
  base: { color: colors.primary, letterSpacing: -0.5 },
  bold: { fontWeight: '800' },
  light: { fontWeight: '400' },
});
