import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';

/** Meses exibidos no gráfico flutuante do site (dashboard.html). */
const MONTHS = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];

// Dados ainda zerados: o gráfico será preenchido com os dados reais
// (TODO do dashboard.js sobre o cartão "Fluxo de caixa").
const MONTHLY_BARS = MONTHS.map((label) => ({ label, receita: 0, despesa: 0 }));

/**
 * Cartão "Fluxo de caixa" (`.cartao` + `.grafico` no dashboard.css):
 * pares de barras por mês, ainda sem movimentações (altura mínima 3px).
 */
export function CashFlowChart() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Fluxo de caixa</Text>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, styles.swatchRevenue]} />
            <Text style={styles.legendText}>Receitas</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, styles.swatchExpense]} />
            <Text style={styles.legendText}>Despesas</Text>
          </View>
        </View>
      </View>

      {/* role="img" do HTML original, com o mesmo aria-label */}
      <View
        accessibilityRole="image"
        accessibilityLabel="Receitas e despesas dos últimos meses, ainda sem movimentações"
        style={styles.chart}
      >
        {MONTHLY_BARS.map(({ label, receita, despesa }) => (
          <View key={label} style={styles.month}>
            <View style={styles.bars}>
              {/* height var(--h, 0px) + min-height 3px do CSS */}
              <View style={[styles.bar, styles.barRevenue, { height: Math.max(3, receita) }]} />
              <View style={[styles.bar, styles.barExpense, { height: Math.max(3, despesa) }]} />
            </View>
            <Text style={styles.monthLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // .cartao
  card: {
    flexGrow: 1,
    minWidth: 0,
    borderRadius: 20,
    // padding 21 / horizontal 23 / inferior 23 (`.cartao`).
    padding: 21,
    paddingHorizontal: 23,
    paddingBottom: 23,
    backgroundColor: BrandColors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontFamily: FontFamily.title,
    fontSize: 19,
    lineHeight: 19 * 1.3,
  },
  legend: {
    flexDirection: 'row',
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: BrandColors.textSoft,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  swatchRevenue: {
    backgroundColor: BrandColors.darkGreen,
  },
  swatchExpense: {
    backgroundColor: BrandColors.lightGreen,
  },

  // .grafico
  chart: {
    marginTop: 46,
    paddingHorizontal: 23,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 206, 198, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 171,
  },
  month: {
    alignItems: 'center',
    gap: 8,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  bar: {
    width: 19,
    height: 3,
    opacity: 0.35,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barRevenue: {
    backgroundColor: BrandColors.darkGreen,
  },
  barExpense: {
    backgroundColor: BrandColors.lightGreen,
  },
  monthLabel: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: BrandColors.textSoft,
  },
});
