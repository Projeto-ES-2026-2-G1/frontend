import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../tema';

export default function Logo({ size = 28, style }: { size?: number; style?: TextStyle }) {
  return (
    <Text style={[styles.base, { fontSize: size }, style]}>
      <Text style={styles.bold}>Simpli</Text>
      <Text style={styles.light}>Mei</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: colors.primary, letterSpacing: -0.5 },
  bold: { fontWeight: '800' },
  light: { fontWeight: '400' },
});