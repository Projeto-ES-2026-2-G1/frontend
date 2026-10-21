import { useWindowDimensions } from 'react-native';
import { Breakpoints } from '../constants/theme';

export interface ResponsiveLayout {
  /** Largura atual da janela/tela, em px. */
  width: number;
  /** Quantidade de colunas do resumo e dos atalhos (igual às media queries). */
  columns: 1 | 2 | 3;
  /** Até 1100px: as linhas de cartões empilham verticalmente. */
  isCardsStacked: boolean;
  /** Até 800px: o menu lateral vira uma faixa horizontal no topo. */
  isMenuInline: boolean;
  /** Até 900px: os painéis do login empilham verticalmente. */
  isLoginStacked: boolean;
}

/**
 * Espelha as media queries do site original usando a largura da janela.
 */
export function useResponsive(): ResponsiveLayout {
  const { width } = useWindowDimensions();

  const columns: ResponsiveLayout['columns'] =
    width > Breakpoints.dashboardMedium
      ? 3
      : width > Breakpoints.dashboardCompact
        ? 2
        : 1;

  return {
    width,
    columns,
    isCardsStacked: width <= Breakpoints.dashboardMedium,
    isMenuInline: width <= Breakpoints.dashboardCompact,
    isLoginStacked: width <= Breakpoints.loginStacked,
  };
}
