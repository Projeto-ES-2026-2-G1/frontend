import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ScreenContainer, Colors, Spacing, BorderRadius } from '@shared';
import { useHomeStatus } from '../hooks';

export function HomeScreen() {
  const { data, isLoading, error } = useHomeStatus();

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SimpliMEI</Text>
        <Text style={styles.subtitle}>Feature-Based Architecture</Text>

        {isLoading && (
          <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
        )}

        {error && (
          <Text style={styles.errorText}>Erro ao carregar dados.</Text>
        )}

        {data && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{data.appName}</Text>
            <Text style={styles.cardBody}>Versão: {data.version}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.status.toUpperCase()}</Text>
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  loader: {
    marginTop: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
