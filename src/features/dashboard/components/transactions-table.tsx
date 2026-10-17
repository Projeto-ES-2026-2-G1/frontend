import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import { EmptyMessage } from './empty-message';

export interface TransactionsTableProps {
  /** ≤800px: a coluna "Categoria" é ocultada (media query do site). */
  hideCategoryColumn?: boolean;
}

/**
 * Cartão "Últimos lançamentos" (tabela `.tabela` do dashboard.css).
 * TODO: preencher as linhas a partir dos dados reais (id corpo-lancamentos
 * do HTML original); enquanto isso, a tabela carrega com a mensagem vazia.
 */
export function TransactionsTable({ hideCategoryColumn = false }: TransactionsTableProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Últimos lançamentos</Text>

        {/* TODO: navegar para a lista completa de lançamentos. */}
        <Pressable
          style={styles.link}
          accessibilityRole="link"
          onPress={() => undefined}
        >
          {({ pressed }) => (
            <Text style={[styles.linkText, pressed && styles.linkTextPressed]}>
              Ver todos
            </Text>
          )}
        </Pressable>
      </View>

      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={styles.headerCell}>Descrição</Text>
          {!hideCategoryColumn && <Text style={styles.headerCell}>Categoria</Text>}
          <Text style={styles.headerCell}>Data</Text>
          <Text style={[styles.headerCell, styles.headerCellRight]}>Valor</Text>
        </View>

        {/* Linha vazia com colspan=4 do HTML original */}
        <View style={styles.rowEmpty}>
          <EmptyMessage style={styles.emptyCell}>
            Nenhum lançamento ainda. Use “Nova movimentação” para começar.
          </EmptyMessage>
        </View>
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
  link: {
    alignSelf: 'flex-start',
  },
  linkText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.darkGreen,
  },
  linkTextPressed: {
    // `.link-acao:hover { text-decoration: underline }`
    textDecorationLine: 'underline',
  },

  // .tabela
  table: {
    width: '100%',
    marginTop: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: BrandColors.textSoft,
  },
  headerCellRight: {
    textAlign: 'right',
  },
  rowEmpty: {
    height: 44,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
    justifyContent: 'center',
  },
  emptyCell: {
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
});
