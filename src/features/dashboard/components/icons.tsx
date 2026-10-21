import React from 'react';
import type { ReactNode } from 'react';
import { Circle, Path, Rect, Svg } from 'react-native-svg';

export interface DashboardIconProps {
  size?: number;
  color: string;
}

interface GlyphDashboardIconProps extends DashboardIconProps {
  children: ReactNode;
}

/**
 * Base comum dos ícones: viewBox 24x24, preenchimento vazio e traço
 * arredondado de 1.8px (equivale ao `.svg.icone` do site).
 */
function GlyphIcon({ size = 20, color, children }: GlyphDashboardIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  );
}

function StrokePath({ d, color }: { d: string; color: string }) {
  return (
    <Path
      d={d}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function StrokeRect({
  x,
  y,
  width,
  height,
  color,
  rx = 0,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rx?: number;
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function StrokeCircle({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Início. */
export function HomeIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M3 11l9-8 9 8" color={color} />
      <StrokePath d="M5 10v10h5v-6h4v6h5V10" color={color} />
    </GlyphIcon>
  );
}

/** Receitas. */
export function IncomeIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M12 4v11" color={color} />
      <StrokePath d="M7 11l5 5 5-5" color={color} />
      <StrokePath d="M5 20h14" color={color} />
    </GlyphIcon>
  );
}

/** Despesas. */
export function ExpenseIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M12 20V9" color={color} />
      <StrokePath d="M7 13l5-5 5 5" color={color} />
      <StrokePath d="M5 4h14" color={color} />
    </GlyphIcon>
  );
}

/** Fluxo de caixa. */
export function CashFlowIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M3 17l6-6 4 4 8-8" color={color} />
      <StrokePath d="M15 7h6v6" color={color} />
    </GlyphIcon>
  );
}

/** Empresas. */
export function CompanyIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M4 21V5l8-2v18" color={color} />
      <StrokePath d="M12 9h8v12" color={color} />
      <StrokePath d="M8 9h1M8 13h1M8 17h1M16 13h1M16 17h1" color={color} />
    </GlyphIcon>
  );
}

/** Contas. */
export function AccountsIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokeRect x={3} y={6} width={18} height={13} rx={2} color={color} />
      <StrokePath d="M3 10h18" color={color} />
      <StrokePath d="M7 15h3" color={color} />
    </GlyphIcon>
  );
}

/** Clientes. */
export function CustomersIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokeCircle cx={12} cy={8} r={4} color={color} />
      <StrokePath d="M4 21c0-4 4-6 8-6s8 2 8 6" color={color} />
    </GlyphIcon>
  );
}

/** Relatórios / Emitir cobrança. */
export function ReportIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M6 3h8l5 5v13H6z" color={color} />
      <StrokePath d="M14 3v5h5" color={color} />
      <StrokePath d="M9 13h7M9 17h7" color={color} />
    </GlyphIcon>
  );
}

/** Configurações. */
export function SettingsIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M4 7h10M18 7h2M4 17h2M10 17h10" color={color} />
      <StrokeCircle cx={16} cy={7} r={2} color={color} />
      <StrokeCircle cx={8} cy={17} r={2} color={color} />
    </GlyphIcon>
  );
}

/** Botão "Nova movimentação" e atalho "Nova receita". */
export function PlusIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M12 5v14M5 12h14" color={color} />
    </GlyphIcon>
  );
}

/** Atalho "Nova despesa". */
export function MinusIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M5 12h14" color={color} />
    </GlyphIcon>
  );
}

/** Atalho "Gerar relatório". */
export function BarChartIcon({ size, color }: DashboardIconProps) {
  return (
    <GlyphIcon size={size} color={color}>
      <StrokePath d="M5 20V12M12 20V5M19 20v-9" color={color} />
    </GlyphIcon>
  );
}
