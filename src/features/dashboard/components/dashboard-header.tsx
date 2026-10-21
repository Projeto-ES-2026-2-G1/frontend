import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BrandColors, FontFamily, formatMonthYear } from '@shared';
import type { FinancialContext } from '../types';
import { ContextSelector } from './context-selector';
import { PlusIcon } from './icons';

export interface DashboardHeaderProps {
  context: FinancialContext;
  onChange: (value: FinancialContext) => void;
  /** ≤800px (media query do site): ações em 100% e busca esticada. */
  isCompact?: boolean;
}

/**
 * Cabeçalho do dashboard (`.topo` no dashboard.css): saudação, subtítulo
 * com o mês atual, seletor de contexto, busca e "Nova movimentação".
 */
export function DashboardHeader({ context, onChange, isCompact = false }: DashboardHeaderProps) {
  const [busca, setBusca] = useState('');

  // Equivalente a dashboard.js: "Resumo financeiro de outubro de 2026".
  const subtituloMes = `Resumo financeiro de ${formatMonthYear(new Date())}`;

  return (
    <View style={styles.topo}>
      <View>
        <Text style={styles.title}>Olá, seja bem-vindo!</Text>
        <Text style={styles.subtitle}>{subtituloMes}</Text>
      </View>

      <View style={[styles.actions, isCompact && styles.actionsCompact]}>
        <ContextSelector value={context} onChange={onChange} />

        <TextInput
          style={[styles.search, isCompact && styles.searchCompact]}
          placeholder="Buscar lançamentos"
          placeholderTextColor="rgba(91, 102, 96, 0.8)"
          accessibilityLabel="Buscar lançamentos"
          value={busca}
          onChangeText={setBusca}
        />

        {/* TODO (do site): abrir o formulário de nova movimentação. */}
        <Pressable
          style={({ pressed }) => [styles.newTransaction, pressed && styles.buttonPressed]}
          accessibilityRole="button"
          onPress={() => undefined}
        >
          <PlusIcon size={20} color={BrandColors.white} />
          <Text style={styles.newTransactionText}>Nova movimentação</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // .topo
  topo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  title: {
    fontFamily: FontFamily.title,
    fontSize: 30,
    lineHeight: 30 * 1.25,
    color: BrandColors.darkGreen,
  },
  subtitle: {
    marginTop: 3,
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: BrandColors.textSoft,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 13,
  },
  // Media query ≤800px: .topo__acoes { width: 100% }
  actionsCompact: {
    width: '100%',
  },
  search: {
    width: 227,
    height: 43,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    borderRadius: 12,
    backgroundColor: BrandColors.white,
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: BrandColors.text,
  },
  // Media query ≤800px: .busca { flex: 1; min-width: 0 }
  searchCompact: {
    width: 'auto',
    flex: 1,
    minWidth: 0,
  },
  // .botao do dashboard
  newTransaction: {
    height: 43,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
    backgroundColor: BrandColors.darkGreen,
  },
  buttonPressed: {
    // Equivalente ao `.botao:hover`.
    backgroundColor: BrandColors.greenHover,
  },
  newTransactionText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.white,
  },
});
