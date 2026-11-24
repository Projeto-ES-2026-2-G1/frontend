import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, FontFamily } from '@shared';
import { isLoggedIn } from '@features/auth';

/**
 * Placeholder mobile para a rota `/empresas` (a interface mobile completa pertence à F4.3).
 */
export function CompaniesScreenMobile() {
  if (!isLoggedIn()) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Empresas</Text>
        <Text style={styles.subtitle}>
          A gestão mobile de empresas será entregue na F4.3.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    fontFamily: FontFamily.title,
    fontSize: 22,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
