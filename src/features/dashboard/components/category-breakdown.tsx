import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import { EmptyMessage } from './empty-message';

/**
 * Cartão "Despesas por categoria" (`.categorias` no dashboard.css).
 * TODO: renderizar as barras (`.categoria__topo`, `.categoria__trilho`,
 * `.categoria__preenchimento`) quando os dados reais existirem.
 */
export function CategoryBreakdown() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Despesas por categoria</Text>

      <View style={styles.list}>
        <EmptyMessage>
          As despesas por categoria aparecem aqui conforme você registra suas
          saídas.
        </EmptyMessage>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontFamily: FontFamily.title,
    fontSize: 19,
    lineHeight: 19 * 1.3,
  },
  // .categorias: margin-top 18px e gap 16px.
  list: {
    marginTop: 18,
    gap: 16,
  },
});
