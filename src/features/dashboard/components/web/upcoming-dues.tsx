import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import { EmptyMessage } from './empty-message';

/**
 * Cartão "Próximos vencimentos" (`.cartao` + `.vencimentos`).
 * TODO: renderizar os itens (`.vencimento`, `.etiqueta--pagar/ently--receber`)
 * quando os dados reais existirem — por enquanto, como no site, a lista
 * carrega vazia.
 */
export function UpcomingDues() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Próximos vencimentos</Text>

      <View style={styles.list}>
        <EmptyMessage>
          Nenhum vencimento por enquanto. Contas a pagar e a receber aparecem
          aqui.
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
  // .vencimentos: margin-top 16px e borda superior.
  list: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
  },
});
