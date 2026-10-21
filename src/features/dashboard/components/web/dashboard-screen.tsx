import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandColors } from '@shared';
import { useResponsive } from '@shared/hooks';
import { isLoggedIn } from '@features/auth';
import type { FinancialContext } from '../../types';
import { CategoryBreakdown } from './category-breakdown';
import { CashFlowChart } from './cash-flow-chart';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { FinancialIndicators } from './financial-indicators';
import { QuickShortcuts } from './quick-shortcuts';
import { TransactionsTable } from './transactions-table';
import { UpcomingDues } from './upcoming-dues';

/** Notas do indicador "Saldo atual" por contexto (dashboard.js do site). */
const CONTEXT_NOTES: Record<FinancialContext, string> = {
  todos: 'Todas as contas',
  empresa: 'Contas da empresa',
  pessoal: 'Contas pessoais',
};

interface DashboardLineProps {
  /** ≥ 1100px: os dois cartões dividem a linha (626fr / 399fr). */
  split: boolean;
  first: ReactNode;
  second: ReactNode;
}

/** Linha de cartões (`.linha` do dashboard.css). */
function DashboardLine({ split, first, second }: DashboardLineProps) {
  return (
    <View style={[styles.line, !split && styles.lineStacked]}>
      <View style={split ? styles.linePrimary : styles.lineItem}>{first}</View>
      <View style={split ? styles.lineSecondary : styles.lineItem}>{second}</View>
    </View>
  );
}

/**
 * Tela inicial interna (dashboard.html + dashboard.css + dashboard.js).
 * Rota protegida (guarda.js): sem sessão, volta para o login.
 */
export function DashboardScreen() {
  const { columns, isCardsStacked, isMenuInline } = useResponsive();
  const [context, setContext] = useState<FinancialContext>('todos');

  if (!isLoggedIn()) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, isMenuInline && styles.safeAreaInline]}
    >
      <View style={[styles.app, isMenuInline && styles.appInline]}>
        <DashboardSidebar isCompact={isMenuInline} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.principal,
            isMenuInline && styles.principalCompact,
          ]}
          showsVerticalScrollIndicator
        >
          <DashboardHeader context={context} onChange={setContext} isCompact={isMenuInline} />

          <FinancialIndicators saldoNote={CONTEXT_NOTES[context]} columns={columns} />

          <DashboardLine split={!isCardsStacked} first={<CashFlowChart />} second={<UpcomingDues />} />

          <QuickShortcuts columns={columns} />

          <DashboardLine
            split={!isCardsStacked}
            first={<TransactionsTable hideCategoryColumn={isMenuInline} />}
            second={<CategoryBreakdown />}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// O botão "Sair" do perfil é parte do menu (dashboard-sidebar).
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.lightGray,
  },
  // No modo compacto o menu é a primeira faixa da tela (fundo verde).
  safeAreaInline: {
    backgroundColor: BrandColors.darkGreen,
  },

  // .app: grid 251px + 1fr (desktop) / coluna única (≤800px).
  app: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    minWidth: 0,
  },
  appInline: {
    flexDirection: 'column',
  },

  scroll: {
    flex: 1,
    minWidth: 0,
    backgroundColor: BrandColors.lightGray,
  },

  // .principal: padding 26px 39px 40px de altura, gap 27px.
  principal: {
    paddingTop: 26,
    paddingHorizontal: 39,
    paddingBottom: 40,
    gap: 27,
  },
  principalCompact: {
    // Media query ≤800px: padding 24px 16px 32px.
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  line: {
    flexDirection: 'row',
    gap: 19,
    minWidth: 0,
  },
  lineStacked: {
    flexDirection: 'column',
    gap: 19,
  },
  linePrimary: {
    // 626fr / 399fr do CSS = base 0 com crescimento proporcional.
    flexGrow: 626,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  lineSecondary: {
    flexGrow: 399,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  lineItem: {
    minWidth: 0,
  },
});
