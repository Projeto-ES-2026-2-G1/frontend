import React from 'react';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import {
  BarChartIcon,
  MinusIcon,
  PlusIcon,
  ReportIcon,
  type DashboardIconProps,
} from './icons';

interface Shortcut {
  label: string;
  Icon: ComponentType<DashboardIconProps>;
}

const SHORTCUTS: Shortcut[] = [
  { label: 'Nova receita', Icon: PlusIcon },
  { label: 'Nova despesa', Icon: MinusIcon },
  { label: 'Emitir cobrança', Icon: ReportIcon },
  { label: 'Gerar relatório', Icon: BarChartIcon },
];

export interface QuickShortcutsProps {
  /** Colunas por linha do resumo (3 ≥ 1100px, 2 > 800px, 1 ≤ 800px). */
  columns: 1 | 2 | 3;
}

/**
 * Seção "Atalhos rápidos" do dashboard (`.atalhos` no dashboard.css).
 */
export function QuickShortcuts({ columns }: QuickShortcutsProps) {
  // O site usa 4 colunas no desktop (e menos nas telas pequenas).
  const perRow = columns === 3 ? 4 : columns;

  const rows: Shortcut[][] = [];
  for (let index = 0; index < SHORTCUTS.length; index += perRow) {
    rows.push(SHORTCUTS.slice(index, index + perRow));
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Atalhos rápidos</Text>

      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row.map(({ label }) => label).join('|')} style={styles.row}>
            {row.map(({ label, Icon }) => (
              <Pressable
                key={label}
                style={({ pressed }) => [
                  styles.shortcut,
                  pressed && styles.shortcutPressed,
                ]}
                accessibilityRole="button"
                onPress={() => {
                  // TODO (do site): abrir o fluxo do respectivo atalho
                  // (dados virão com a API).
                }}
              >
                <View style={styles.iconTile}>
                  <Icon size={22} color={BrandColors.darkGreen} />
                </View>
                <Text numberOfLines={1} style={styles.shortcutText}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FontFamily.title,
    fontSize: 19,
    lineHeight: 19 * 1.3,
    marginBottom: 14,
  },
  // .atalhos__lista
  grid: {
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  shortcut: {
    flex: 1,
    minWidth: 0,
    height: 72,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    backgroundColor: BrandColors.white,
  },
  shortcutPressed: {
    // Equivalente ao `.atalho:hover`.
    boxShadow: '0 0 0 2px #97BF8A',
  },
  iconTile: {
    width: 42,
    height: 42,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: BrandColors.lightGreen,
  },
  shortcutText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.text,
    textAlign: 'left',
  },
});
