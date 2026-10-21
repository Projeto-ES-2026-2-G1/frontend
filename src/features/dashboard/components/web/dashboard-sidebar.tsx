import React from 'react';
import type { ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { BrandColors, FontFamily } from '@shared';
import { logOut } from '@features/auth';
import {
  AccountsIcon,
  CashFlowIcon,
  CompanyIcon,
  CustomersIcon,
  ExpenseIcon,
  HomeIcon,
  IncomeIcon,
  ReportIcon,
  SettingsIcon,
  type DashboardIconProps,
} from './icons';

interface MenuItem {
  /** Destino do item ("#" = ainda sem tela, como no site). */
  href: '/dashboard' | '#';
  label: string;
  Icon: ComponentType<DashboardIconProps>;
}

const BRAND = 'Gestão na Mão';

// Mesmos itens e ícones do menu.js. "Empresas" e "Contas" apontavam para
// páginas que não existem no site (empresas.html / contas.html); continuam
// inertes até as telas existirem.
const MENU_ITEMS: MenuItem[] = [
  { href: '/dashboard', label: 'Início', Icon: HomeIcon },
  { href: '#', label: 'Receitas', Icon: IncomeIcon },
  { href: '#', label: 'Despesas', Icon: ExpenseIcon },
  { href: '#', label: 'Fluxo de caixa', Icon: CashFlowIcon },
  // TODO: criar as telas de Empresas e Contas (referências do menu original).
  { href: '#', label: 'Empresas', Icon: CompanyIcon },
  { href: '#', label: 'Contas', Icon: AccountsIcon },
  { href: '#', label: 'Clientes', Icon: CustomersIcon },
  { href: '#', label: 'Relatórios', Icon: ReportIcon },
  { href: '#', label: 'Configurações', Icon: SettingsIcon },
];

export interface DashboardSidebarProps {
  /** ≤800px: o menu vira uma faixa horizontal no topo da página. */
  isCompact?: boolean;
}

/**
 * Menu lateral compartilhado pelas telas internas
 * (`.menu` do dashboard.css, conteúdo gerado pelo menu.js do site).
 */
export function DashboardSidebar({ isCompact = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const itemIsCurrent = (href: string) => href !== '#' && pathname === href;

  function openItem(item: MenuItem) {
    // Itens sem tela não navegam (o site também impedia esses links).
    if (item.href === '#') return;
    router.push(item.href);
  }

  const menuItems = MENU_ITEMS.map(({ href, label, Icon }) => {
    const isCurrent = itemIsCurrent(href);

    return (
      <Pressable
        key={label}
        style={({ pressed }) => [
          styles.navItem,
          isCurrent && styles.navItemCurrent,
          pressed && !isCurrent && styles.navItemPressed,
        ]}
        accessibilityRole="link"
        accessibilityLabel={isCurrent ? `${label}, página atual` : label}
        onPress={() => openItem({ href, label, Icon })}
      >
        <Icon
          size={20}
          color={isCurrent ? BrandColors.white : 'rgba(232, 234, 229, 0.85)'}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.navItemText,
            isCurrent ? styles.navItemTextCurrent : styles.navItemTextDefault,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  });

  const navList = (
    <View style={isCompact ? styles.navListInline : styles.navList}>{menuItems}</View>
  );

  // ===== Menu em faixa horizontal (≤800px) =====
  if (isCompact) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.menuCompact}
        contentContainerStyle={styles.menuCompactContent}
      >
        <Text style={[styles.brand, styles.brandCompact]}>{BRAND}</Text>
        {navList}
      </ScrollView>
    );
  }

  // ===== Menu lateral fixo (desktop) =====
  return (
    <View style={styles.menu}>
      <Text style={styles.brand}>{BRAND}</Text>
      {navList}

      {/* Perfil (rodapé do menu) */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ME</Text>
        </View>
        <View>
          <Text style={styles.profileName}>Minha empresa</Text>
          <Text style={styles.profileType}>Microempreendedor</Text>
        </View>
        <Pressable
          style={styles.signOut}
          accessibilityRole="button"
          onPress={() => {
            logOut();
            // Equivalente ao `location.href = 'login.html'` do menu.js.
            router.replace('/login');
          }}
        >
          {({ pressed }) => (
            <Text style={[styles.signOutText, pressed && styles.signOutTextPressed]}>
              Sair
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // .menu (desktop)
  menu: {
    width: 251,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 19,
    backgroundColor: BrandColors.darkGreen,
  },

  // .menu compacto (≤800px)
  menuCompact: {
    width: '100%',
    backgroundColor: BrandColors.darkGreen,
  },
  menuCompactContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  brand: {
    paddingHorizontal: 6,
    fontFamily: FontFamily.title,
    fontSize: 20,
    color: BrandColors.white,
  },
  // Media query ≤800px: .menu__marca { padding: 0 }
  brandCompact: {
    paddingHorizontal: 0,
  },

  // .menu__lista (desktop): margin-top 40px e gap 5px.
  navList: {
    marginTop: 40,
    gap: 5,
    alignItems: 'stretch',
  },
  // Media query ≤800px: lista em linha com gap 6px.
  navListInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  navItem: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 12,
  },
  navItemCurrent: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  navItemPressed: {
    // Equivalente ao `.menu__item:hover`.
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  navItemText: {
    fontFamily: FontFamily.body,
    fontSize: 16,
  },
  navItemTextDefault: {
    color: 'rgba(232, 234, 229, 0.85)',
  },
  navItemTextCurrent: {
    fontFamily: FontFamily.bodyMedium,
    color: BrandColors.white,
  },

  profile: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatar: {
    width: 38,
    height: 38,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: BrandColors.lightGreen,
  },
  avatarText: {
    fontFamily: FontFamily.title,
    fontSize: 14,
    color: BrandColors.darkGreen,
  },
  profileName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    lineHeight: 14 * 1.3,
    color: BrandColors.white,
  },
  profileType: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 12 * 1.3,
    color: 'rgba(232, 234, 229, 0.7)',
  },
  signOut: {
    marginLeft: 'auto',
  },
  signOutText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: 'rgba(232, 234, 229, 0.85)',
  },
  signOutTextPressed: {
    // Equivalente ao `.perfil__sair:hover`.
    textDecorationLine: 'underline',
  },
});
