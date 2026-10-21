import React from 'react';
import { StyleSheet, View } from 'react-native';
import { formatCurrency } from '@shared';
import { IndicatorCard, type IndicatorCardProps } from './indicator-card';

export interface FinancialIndicatorsProps {
  /** Nota do indicador "Saldo atual", que muda com o contexto selecionado. */
  saldoNote: string;
  /** Colunas por linha (3 ≥ 1100px, 2 > 800px, 1 ≤ 800px, como no site). */
  columns: 1 | 2 | 3;
}

/**
 * Seção "Resumo financeiro" do dashboard (`.resumo` no dashboard.css).
 * TODO: carregar os valores a partir dos dados reais (ids valor-saldo,
 * valor-receitas, valor-despesas, valor-a-receber, valor-resultado e
 * valor-retiradas do HTML original).
 */
export function FinancialIndicators({ saldoNote, columns }: FinancialIndicatorsProps) {
  // Valores ainda zerados: as movimentações serão carregadas com a API.
  const valorInicial = formatCurrency(0);

  const items: IndicatorCardProps[] = [
    { label: 'Saldo atual', value: valorInicial, note: saldoNote, variant: 'dark' },
    { label: 'Receitas', value: valorInicial, note: 'Neste mês' },
    { label: 'Despesas', value: valorInicial, note: 'Neste mês' },
    { label: 'Resultado do período', value: valorInicial, note: 'Receitas menos despesas' },
    { label: 'A receber', value: valorInicial, note: 'Próximos dias', variant: 'light' },
    { label: 'Retiradas para uso pessoal', value: valorInicial, note: 'Da empresa, neste mês' },
  ];

  // O site usa grid com N colunas; aqui as linhas são fatiadas
  // para reproduzir o mesmo arranjo de cards.
  const rows: IndicatorCardProps[][] = [];
  for (let index = 0; index < items.length; index += columns) {
    rows.push(items.slice(index, index + columns));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row.map(({ label }) => label).join('|')} style={styles.row}>
          {row.map((item) => (
            <IndicatorCard key={item.label} {...item} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // .resumo: grid com gap 19px.
  grid: {
    gap: 19,
  },
  row: {
    flexDirection: 'row',
    gap: 19,
  },
});
