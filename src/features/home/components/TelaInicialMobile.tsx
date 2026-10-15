import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import  Logo  from './Logo';
import { colors, radius } from '../../tema';

type CashFlow = { month: string; income: number; expense: number };
type Bill = { id: string; title: string; subtitle: string; amount: number; icon: keyof typeof Feather.glyphMap };

const cashFlow: CashFlow[] = [
  { month: 'Mai', income: 80, expense: 50 },
  { month: 'Jun', income: 90, expense: 60 },
  { month: 'Jul', income: 85, expense: 55 },
  { month: 'Ago', income: 100, expense: 65 },
  { month: 'Set', income: 95, expense: 60 },
  { month: 'Out', income: 105, expense: 70 },
];

const bills: Bill[] = [
  { id: '1', title: 'DAS MEI', subtitle: '20 out · Imposto mensal', amount: 75.9, icon: 'file-text' },
  { id: '2', title: 'Internet', subtitle: '22 out · Conta do negócio', amount: 99.9, icon: 'wifi' },
];

const formatBRL = (v: number) =>
  'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const CHART_HEIGHT = 110;
const maxValue = Math.max(...cashFlow.flatMap((c) => [c.income, c.expense]));

type Props = {
  onNewIncome?: () => void;
  onNewExpense?: () => void;
  onSeeBills?: () => void;
  onNotifications?: () => void;
};

export default function TelaInicial({ onNewIncome, onNewExpense, onSeeBills, onNotifications }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topRow}>
          <Logo size={26} />
          <TouchableOpacity style={styles.bell} onPress={onNotifications}>
            <Feather name="bell" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.greeting}>Olá, bem-vindo de volta</Text>
        <Text style={styles.greetingSub}>Seu financeiro, de um jeito simples.</Text>

        {/* Cash flow */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Fluxo de caixa</Text>
            <View style={styles.legend}>
              <LegendItem color={colors.primary} label="Receitas" />
              <LegendItem color={colors.primarySoft} label="Despesas" />
            </View>
          </View>
          <View style={styles.chart}>
            {cashFlow.map((c) => (
              <View key={c.month} style={styles.chartCol}>
                <View style={styles.bars}>
                  <View style={[styles.bar, { height: (c.income / maxValue) * CHART_HEIGHT, backgroundColor: colors.primary }]} />
                  <View style={[styles.bar, { height: (c.expense / maxValue) * CHART_HEIGHT, backgroundColor: colors.primarySoft }]} />
                </View>
                <Text style={styles.month}>{c.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Shortcuts */}
        <Text style={styles.section}>Atalhos rápidos</Text>
        <View style={styles.shortcuts}>
          <Shortcut icon="plus" label="Nova receita" onPress={onNewIncome} />
          <Shortcut icon="minus" label="Nova despesa" onPress={onNewExpense} />
        </View>

        {/* Bills */}
        <View style={[styles.card, { paddingHorizontal: 16 }]}>
          <TouchableOpacity style={styles.billsHeader} onPress={onSeeBills}>
            <Text style={styles.cardTitle}>Próximos vencimentos</Text>
            <Feather name="chevron-right" size={18} color={colors.primary} />
          </TouchableOpacity>
          {bills.map((b, i) => (
            <View key={b.id} style={[styles.billRow, i > 0 && styles.billDivider]}>
              <View style={styles.billIcon}>
                <Feather name={b.icon} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.billTitle}>{b.title}</Text>
                <Text style={styles.billSub}>{b.subtitle}</Text>
              </View>
              <Text style={styles.billAmount}>{formatBRL(b.amount)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function Shortcut({ icon, label, onPress }: { icon: 'plus' | 'minus'; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.shortcut} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.shortcutIcon}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.shortcutText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 32 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bell: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  greeting: { marginTop: 20, fontSize: 18, fontWeight: '700', color: colors.primary },
  greetingSub: { marginTop: 4, fontSize: 11, color: colors.textMuted, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 20, marginBottom: 24 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: colors.primary },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  legend: { flexDirection: 'row', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  legendDot: { width: 6, height: 6 },
  legendText: { fontSize: 7, color: colors.textMuted },
  chart: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.primarySofter,
  },
  chartCol: { alignItems: 'center', flex: 1 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: CHART_HEIGHT },
  bar: { width: 9, borderRadius: 1 },
  month: { marginTop: 8, fontSize: 9, color: colors.textMuted },
  section: { fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 14 },
  shortcuts: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  shortcut: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, height: 72,
  },
  shortcutIcon: {
    width: 30, height: 30, borderRadius: 6, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  shortcutText: { fontSize: 11, color: colors.text },
  billsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  billRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  billDivider: { borderTopWidth: 1, borderTopColor: colors.primarySofter },
  billIcon: {
    width: 30, height: 30, borderRadius: 6, backgroundColor: colors.primarySofter,
    alignItems: 'center', justifyContent: 'center',
  },
  billTitle: { fontSize: 11, fontWeight: '600', color: colors.text },
  billSub: { fontSize: 9, color: colors.textMuted, marginTop: 4 },
  billAmount: { fontSize: 11, fontWeight: '700', color: colors.primary },
});