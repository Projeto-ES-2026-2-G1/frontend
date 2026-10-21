import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Logo, LogoText } from '@shared/components';
import { colors as theme, radius, shadow } from '@shared';

const colors = {
  ...theme,
  bg: theme.background,
  card: theme.surface,
  muted: theme.textMuted,
  primarySoft: theme.primarySoft,
  primaryTint: theme.primaryTint,
  track: theme.track,
  danger: theme.danger,
  dangerTint: theme.dangerTint,
  success: theme.success,
};

type Kpi = {
  id: string;
  label: string;
  value: string;
  caption: string;
  highlight?: boolean;
  color?: boolean;
};
type Shortcut = {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};
type Entry = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
};
type Category = { name: string; pct: number; strong?: boolean };
type Due = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'pagar' | 'receber';
};

const KPIS: Kpi[] = [
  {
    id: '1',
    label: 'Saldo atual',
    value: 'R$ 18.450,00',
    caption: 'Todas as contas',
    highlight: true,
  },
  {
    id: '2',
    label: 'Receitas',
    value: 'R$ 24.870,00',
    caption: '+12% vs. mês anterior',
  },
  {
    id: '3',
    label: 'Despesas',
    value: 'R$ 6.420,00',
    caption: '-4% vs. mês anterior',
  },
  {
    id: '4',
    label: 'A receber',
    value: 'R$ 3.200,00',
    caption: '1 cobrança pendente',
    color: true,
  },
];

const CASHFLOW = [
  { m: 'Mai', r: 75, d: 48 },
  { m: 'Jun', r: 85, d: 56 },
  { m: 'Jul', r: 80, d: 52 },
  { m: 'Ago', r: 95, d: 62 },
  { m: 'Set', r: 90, d: 58 },
  { m: 'Out', r: 100, d: 66 },
];

const SHORTCUTS: Shortcut[] = [
  { id: '1', label: 'Nova receita', icon: 'plus' },
  { id: '2', label: 'Nova despesa', icon: 'minus' },
  { id: '3', label: 'Emitir cobrança', icon: 'file-text' },
  { id: '4', label: 'Gerar relatório', icon: 'bar-chart-2' },
  { id: '5', label: 'Emitir DAS', icon: 'calendar' },
];

const ENTRIES: Entry[] = [
  {
    id: '1',
    title: 'Venda – Padaria Sol',
    category: 'Vendas',
    date: '12/10',
    amount: 3200,
  },
  {
    id: '2',
    title: 'Compra de insumos',
    category: 'Fornecedores',
    date: '11/10',
    amount: -2340,
  },
  {
    id: '3',
    title: 'Serviço de entrega',
    category: 'Serviços',
    date: '10/10',
    amount: 850,
  },
  {
    id: '4',
    title: 'Conta de energia',
    category: 'Contas fixas',
    date: '09/10',
    amount: -412.5,
  },
  {
    id: '5',
    title: 'Venda – Balcão',
    category: 'Vendas',
    date: '08/10',
    amount: 1275,
  },
  {
    id: '6',
    title: 'Internet',
    category: 'Contas fixas',
    date: '07/10',
    amount: -129.9,
  },
  {
    id: '7',
    title: 'Venda – Mercado Bom',
    category: 'Vendas',
    date: '05/10',
    amount: 980,
  },
];

const CATEGORIES: Category[] = [
  { name: 'Fornecedores', pct: 42, strong: true },
  { name: 'Aluguel', pct: 19, strong: true },
  { name: 'Contas fixas', pct: 14 },
  { name: 'Marketing', pct: 11 },
  { name: 'Outros', pct: 14 },
  { name: 'Transporte', pct: 6 },
];

const DUES: Due[] = [
  {
    id: '1',
    title: 'Aluguel do ponto',
    date: '15/10',
    amount: 1800,
    type: 'pagar',
  },
  {
    id: '2',
    title: 'Fornecedor Alfa',
    date: '17/10',
    amount: 2340,
    type: 'pagar',
  },
  {
    id: '3',
    title: 'Padaria Sol',
    date: '18/10',
    amount: 3200,
    type: 'receber',
  },
  {
    id: '4',
    title: 'Energia elétrica',
    date: '20/10',
    amount: 412.5,
    type: 'pagar',
  },
];

const brl = (v: number) =>
  'R$ ' +
  Math.abs(v).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const { width: SCREEN_W } = Dimensions.get('window');
const H_PAD = 24;
const KPI_W = SCREEN_W * 0.42;
const KPI_GAP = 12;
const LIST_MAX_H = 270;

function Header() {
  return (
    <View style={s.headerRow}>
      <Logo size={44} />
      <LogoText size={26} style={{ marginLeft: 10 }} />
      <TouchableOpacity style={s.bell} accessibilityLabel="Notificações">
        <Feather name="bell" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

function KpiCarousel() {
  const [index, setIndex] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (KPI_W + KPI_GAP));
    if (i !== index) setIndex(i);
  };
  return (
    <View>
      <FlatList
        data={KPIS}
        horizontal
        keyExtractor={(k) => k.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={KPI_W + KPI_GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: H_PAD }}
        ItemSeparatorComponent={() => <View style={{ width: KPI_GAP }} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
            style={[
              s.kpi,
              item.highlight && s.kpiHighlight,
              item.color && s.kpiColor,
            ]}
          >
            <Text
              style={[
                s.kpiLabel,
                item.highlight && s.onPrimary,
                item.color && s.primary,
              ]}
            >
              {item.label}
            </Text>
            <Text
              style={[
                s.kpiValue,
                item.highlight && s.onPrimary,
                item.color && s.primary,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {item.value}
            </Text>
            <Text
              style={[
                s.kpiCaption,
                item.highlight
                  ? s.onPrimary
                  : item.color
                    ? { color: colors.primary }
                    : { color: colors.success },
              ]}
            >
              {item.caption}
            </Text>
          </View>
        )}
      />
      <View style={s.dots}>
        {KPIS.map((k, i) => (
          <View key={k.id} style={[s.dot, i === index && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function CashFlowChart() {
  const H = 110;
  return (
    <View style={[s.card, s.mx]}>
      <View style={s.rowBetween}>
        <Text style={s.cardTitle}>Fluxo de caixa</Text>
        <View style={s.row}>
          <Legend color={colors.primary} label="Receitas" />
          <Legend color={colors.primarySoft} label="Despesas" />
        </View>
      </View>
      <View style={[s.chart, { height: H + 24 }]}>
        {CASHFLOW.map((c) => (
          <View key={c.m} style={s.chartCol}>
            <View
              style={[s.row, { alignItems: 'flex-end', height: H, gap: 4 }]}
            >
              <View
                style={[
                  s.bar,
                  {
                    height: (c.r / 100) * H,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  s.bar,
                  {
                    height: (c.d / 100) * H,
                    backgroundColor: colors.primarySoft,
                  },
                ]}
              />
            </View>
            <Text style={s.chartLabel}>{c.m}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <View style={[s.row, { marginLeft: 8 }]}>
    <View
      style={{
        width: 7,
        height: 7,
        backgroundColor: color,
        marginRight: 4,
      }}
    />
    <Text style={{ fontSize: 9, color: colors.muted }}>{label}</Text>
  </View>
);

function Shortcuts() {
  return (
    <View>
      <Text style={[s.sectionTitle, s.mx]}>Atalhos rápidos</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: H_PAD, gap: 10 }}
      >
        {SHORTCUTS.map((sc) => (
          <TouchableOpacity key={sc.id} style={s.shortcut} activeOpacity={0.7}>
            <View style={s.shortcutIcon}>
              <Feather name={sc.icon} size={18} color={colors.primary} />
            </View>
            <Text style={s.shortcutLabel}>{sc.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const Tag = ({ label, negative }: { label: string; negative?: boolean }) => (
  <View
    style={[
      s.tag,
      { backgroundColor: negative ? colors.dangerTint : colors.primaryTint },
    ]}
  >
    <Text
      style={[
        s.tagText,
        { color: negative ? colors.danger : colors.success },
      ]}
    >
      {label}
    </Text>
  </View>
);

function LatestEntries() {
  return (
    <View style={[s.card, s.mx]}>
      <View style={[s.rowBetween, s.cardHeader]}>
        <Text style={s.cardTitle}>Últimos lançamentos</Text>
        <TouchableOpacity>
          <Text style={s.link}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ maxHeight: LIST_MAX_H }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {ENTRIES.map((e, i) => {
          const neg = e.amount < 0;
          return (
            <View key={e.id} style={[s.listItem, i > 0 && s.divider]}>
              <View style={{ flex: 1 }}>
                <Text style={s.itemTitle}>{e.title}</Text>
                <View style={[s.row, { marginTop: 4 }]}>
                  <Tag label={e.category} negative={neg} />
                  <Text style={s.itemDate}>{e.date}</Text>
                </View>
              </View>
              <Text
                style={[
                  s.amount,
                  { color: neg ? colors.danger : colors.success },
                ]}
              >
                {neg ? '- ' : '+ '}
                {brl(e.amount)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ExpensesByCategory() {
  return (
    <View style={[s.card, s.mx]}>
      <Text style={[s.cardTitle, { marginBottom: 12 }]}>
        Despesas por categoria
      </Text>
      <ScrollView
        style={{ maxHeight: LIST_MAX_H - 40 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {CATEGORIES.map((c) => (
          <View key={c.name} style={{ marginBottom: 16 }}>
            <View style={s.rowBetween}>
              <Text style={s.catName}>{c.name}</Text>
              <Text style={s.catPct}>{c.pct}%</Text>
            </View>
            <View style={s.track}>
              <View
                style={[
                  s.fill,
                  {
                    width: `${c.pct}%`,
                    backgroundColor: c.strong
                      ? colors.primary
                      : colors.primarySoft,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function UpcomingDues() {
  return (
    <View style={[s.card, s.mx]}>
      <View style={[s.rowBetween, s.cardHeader]}>
        <Text style={s.cardTitle}>Próximos vencimentos</Text>
        <Feather name="chevron-right" size={18} color={colors.primary} />
      </View>
      {DUES.map((d, i) => {
        const pay = d.type === 'pagar';
        return (
          <View key={d.id} style={[s.listItem, i > 0 && s.divider]}>
            <View
              style={[
                s.dueIcon,
                {
                  backgroundColor: pay
                    ? colors.dangerTint
                    : colors.primaryTint,
                },
              ]}
            >
              <Feather
                name="file-text"
                size={16}
                color={pay ? colors.danger : colors.success}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.itemTitle}>{d.title}</Text>
              <View style={[s.row, { marginTop: 4 }]}>
                <Tag label={pay ? 'A pagar' : 'A receber'} negative={pay} />
                <Text style={s.itemDate}>{d.date}</Text>
              </View>
            </View>
            <Text style={[s.amount, { color: colors.text }]}>
              {brl(d.amount)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

type TabKey = 'inicio' | 'mov' | 'rel' | 'perfil';
const TABS: {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: 'inicio', label: 'Início', icon: 'home' },
  { key: 'mov', label: 'Movimentações', icon: 'repeat' },
  { key: 'rel', label: 'Relatórios', icon: 'trending-up' },
  { key: 'perfil', label: 'Perfil', icon: 'user' },
];

export function BottomTabBar({
  active = 'inicio',
  onChange,
}: {
  active?: TabKey;
  onChange?: (k: TabKey) => void;
}) {
  return (
    <SafeAreaView edges={['bottom']} style={s.tabBar}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            style={s.tab}
            onPress={() => onChange?.(t.key)}
          >
            <View
              style={[s.tabIcon, on && { backgroundColor: colors.primaryTint }]}
            >
              <Feather
                name={t.icon}
                size={20}
                color={on ? colors.primary : colors.muted}
              />
            </View>
            <Text
              style={[
                s.tabLabel,
                on && { color: colors.primary, fontWeight: '700' },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}

export type DashboardScreenMobileProps = {
  onLogout?: () => void;
};

export function DashboardScreenMobile(_props: DashboardScreenMobileProps) {
  const [query, setQuery] = useState('');
  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.mx}>
          <Header />
          <Text style={s.hello}>Olá, bem-vindo de volta</Text>
          <Text style={s.subtitle}>Resumo financeiro de outubro de 2026</Text>
          <View style={s.search}>
            <Feather name="search" size={16} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar lançamentos"
              placeholderTextColor={colors.placeholder}
              style={s.searchInput}
            />
          </View>
          <Text style={s.overview}>Visão geral · outubro 2026</Text>
        </View>

        <KpiCarousel />
        <View style={s.gap} />
        <CashFlowChart />
        <View style={s.gap} />
        <Shortcuts />
        <View style={s.gap} />
        <LatestEntries />
        <View style={s.gap} />
        <ExpensesByCategory />
        <View style={s.gap} />
        <UpcomingDues />
      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

export default DashboardScreenMobile;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  mx: { marginHorizontal: H_PAD },
  gap: { height: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onPrimary: { color: '#fff' },
  primary: { color: theme.primary },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontSize: 24, fontWeight: '800', color: colors.primary },
  bell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hello: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 18,
  },
  subtitle: { fontSize: 12, color: colors.muted, marginTop: 4 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.text },
  overview: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 20,
    marginBottom: 12,
  },

  kpi: {
    width: KPI_W,
    minHeight: 108,
    borderRadius: radius.lg,
    ...shadow,
    backgroundColor: colors.card,
    padding: 16,
    justifyContent: 'space-between',
  },
  kpiHighlight: { backgroundColor: colors.primary },
  kpiLabel: { fontSize: 11, color: colors.muted },
  kpiColor: { backgroundColor: colors.primarySoft },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 8,
  },
  kpiCaption: { fontSize: 10, color: colors.muted },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C9CEC9' },
  dotActive: { width: 16, backgroundColor: colors.primary },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow,
  },
  cardHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.primary },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  link: { fontSize: 11, fontWeight: '700', color: colors.primary },

  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  chartCol: { alignItems: 'center' },
  bar: { width: 10, borderRadius: 2 },
  chartLabel: { fontSize: 9, color: colors.muted, marginTop: 8 },

  shortcut: {
    width: 88,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  shortcutIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutLabel: { fontSize: 10, color: colors.text, textAlign: 'center' },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  itemTitle: { fontSize: 12, fontWeight: '600', color: colors.text },
  itemDate: { fontSize: 9, color: colors.muted, marginLeft: 6 },
  amount: { fontSize: 11, fontWeight: '700' },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  tagText: { fontSize: 9, fontWeight: '700' },
  dueIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  catName: { fontSize: 12, color: colors.text },
  catPct: { fontSize: 11, fontWeight: '700', color: colors.text },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.track,
    marginTop: 8,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabIcon: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  tabLabel: { fontSize: 10, color: colors.muted, marginTop: 4 },
});
