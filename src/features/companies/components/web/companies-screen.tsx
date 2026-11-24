import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandColors, FontFamily, formatCnpj } from '@shared';
import { useResponsive } from '@shared/hooks';
import { isLoggedIn } from '@features/auth';
import { DashboardSidebar } from '@features/dashboard/components/web/dashboard-sidebar';
import { PlusIcon } from '@features/dashboard/components/web/icons';
import { useCompanies } from '../../context';
import { getCompanyErrorMessage } from '../../service';
import type { Company, CompanyPayload } from '../../types';
import { ActiveCompanySelector } from './active-company-selector';
import { CompanyCard } from './company-card';
import { CompanyFormModal } from './company-form-modal';
import { BuildingIcon, CloseIcon } from './icons';

interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

/**
 * Tela Web de gestão de múltiplas empresas (`/empresas`, entrega F4.2).
 * Rota protegida: sem sessão autenticada, redireciona para `/login`.
 */
export function CompaniesScreen() {
  const { isMenuInline } = useResponsive();
  const {
    companies,
    activeCompany,
    primaryCompany,
    activeCompanyId,
    setActiveCompanyId,
    isLoading,
    error,
    reloadCompanies,
    createCompany,
    updateCompany,
    setPrimaryCompany,
  } = useCompanies();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [updatingPrimaryId, setUpdatingPrimaryId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return companies;

    const queryDigits = query.replace(/\D/g, '');

    return companies.filter((company) => {
      const textFields = [
        company.name,
        company.tradeName,
        company.businessType,
        company.email,
        company.cnpj ? formatCnpj(company.cnpj) : null,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (textFields.includes(query)) return true;
      if (queryDigits && company.cnpj?.includes(queryDigits)) return true;
      return false;
    });
  }, [companies, searchQuery]);

  if (!isLoggedIn()) {
    return <Redirect href="/login" />;
  }

  function handleOpenCreate() {
    setEditingCompany(null);
    setModalVisible(true);
  }

  function handleOpenEdit(company: Company) {
    setEditingCompany(company);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setEditingCompany(null);
  }

  async function handleSubmitForm(payload: CompanyPayload) {
    if (editingCompany) {
      await updateCompany(editingCompany.id, payload);
      setFeedback({
        type: 'success',
        text: `Empresa "${payload.name}" atualizada com sucesso.`,
      });
      return;
    }

    await createCompany(payload);
    setFeedback({
      type: 'success',
      text: `Empresa "${payload.name}" cadastrada com sucesso.`,
    });
  }

  function handleSelectActive(company: Company) {
    setActiveCompanyId(company.id);
    setFeedback({
      type: 'success',
      text: `"${company.name}" agora é a empresa ativa no cabeçalho.`,
    });
  }

  async function handleSetPrimary(company: Company) {
    setUpdatingPrimaryId(company.id);
    setFeedback(null);

    try {
      await setPrimaryCompany(company.id);
      setFeedback({
        type: 'success',
        text: `"${company.name}" foi definida como empresa principal.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: getCompanyErrorMessage(err),
      });
    } finally {
      setUpdatingPrimaryId(null);
    }
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
          {/* Cabeçalho da página */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Empresas</Text>
              <Text style={styles.subtitle}>
                Cadastre suas empresas, defina a principal e escolha a empresa ativa.
              </Text>
            </View>

            <View style={[styles.headerActions, isMenuInline && styles.headerActionsCompact]}>
              <ActiveCompanySelector showManageLink={false} fullWidth={isMenuInline} />

              <Pressable
                style={({ pressed }) => [
                  styles.newCompanyButton,
                  pressed && styles.newCompanyButtonPressed,
                ]}
                accessibilityRole="button"
                onPress={handleOpenCreate}
              >
                <PlusIcon size={20} color={BrandColors.white} />
                <Text style={styles.newCompanyButtonText}>Nova empresa</Text>
              </Pressable>
            </View>
          </View>

          {/* Resumo rápido */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.summaryCardDark]}>
              <Text style={styles.summaryLabelLight}>Empresas cadastradas</Text>
              <Text style={styles.summaryValueLight}>{companies.length}</Text>
              <Text style={styles.summaryNoteLight}>
                {companies.length === 1 ? '1 CNPJ/negócio vinculado' : `${companies.length} negócios vinculados`}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Empresa ativa</Text>
              <Text numberOfLines={1} style={styles.summaryValue}>
                {activeCompany?.name ?? 'Nenhuma'}
              </Text>
              <Text style={styles.summaryNote}>
                Selecionada no cabeçalho global
              </Text>
            </View>

            <View style={[styles.summaryCard, styles.summaryCardLight]}>
              <Text style={styles.summaryLabelSoftDark}>Empresa principal</Text>
              <Text numberOfLines={1} style={styles.summaryValue}>
                {primaryCompany?.name ?? 'Nenhuma'}
              </Text>
              <Text style={styles.summaryNoteSoftDark}>
                Referência padrão da sua conta
              </Text>
            </View>
          </View>

          {/* Avisos de feedback ou erro da API */}
          {feedback && (
            <View
              style={[
                styles.banner,
                feedback.type === 'success' ? styles.bannerSuccess : styles.bannerError,
              ]}
              accessibilityRole="alert"
            >
              <Text
                style={[
                  styles.bannerText,
                  feedback.type === 'success'
                    ? styles.bannerTextSuccess
                    : styles.bannerTextError,
                ]}
              >
                {feedback.text}
              </Text>
              <Pressable
                style={styles.bannerClose}
                accessibilityRole="button"
                accessibilityLabel="Fechar aviso"
                onPress={() => setFeedback(null)}
              >
                <CloseIcon
                  size={16}
                  color={
                    feedback.type === 'success'
                      ? BrandColors.toReceiveText
                      : BrandColors.toPayText
                  }
                />
              </Pressable>
            </View>
          )}

          {error && (
            <View style={[styles.banner, styles.bannerError]} accessibilityRole="alert">
              <Text style={[styles.bannerText, styles.bannerTextError]}>{error}</Text>
              <Pressable
                style={styles.retryButton}
                accessibilityRole="button"
                onPress={() => {
                  void reloadCompanies();
                }}
              >
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </Pressable>
            </View>
          )}

          {/* Barra de busca */}
          {companies.length > 0 && (
            <View style={styles.toolbar}>
              <TextInput
                style={[styles.searchInput, isMenuInline && styles.searchInputCompact]}
                placeholder="Buscar por nome, nome fantasia, tipo ou CNPJ"
                placeholderTextColor="rgba(91, 102, 96, 0.8)"
                accessibilityLabel="Buscar empresas"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <Text style={styles.countText}>
                Exibindo {filteredCompanies.length} de {companies.length}{' '}
                {companies.length === 1 ? 'empresa' : 'empresas'}
              </Text>
            </View>
          )}

          {/* Listagem / estados */}
          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator size="large" color={BrandColors.darkGreen} />
              <Text style={styles.stateTitle}>Carregando empresas...</Text>
              <Text style={styles.stateSubtitle}>
                Aguarde enquanto buscamos os cadastros vinculados à sua conta.
              </Text>
            </View>
          ) : companies.length === 0 ? (
            <View style={styles.stateCard}>
              <View style={styles.emptyIconBadge}>
                <BuildingIcon size={28} color={BrandColors.darkGreen} />
              </View>
              <Text style={styles.stateTitle}>Nenhuma empresa cadastrada</Text>
              <Text style={styles.stateSubtitle}>
                Cadastre sua primeira empresa para separar receitas, despesas e contas por negócio.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.newCompanyButton,
                  pressed && styles.newCompanyButtonPressed,
                ]}
                accessibilityRole="button"
                onPress={handleOpenCreate}
              >
                <PlusIcon size={20} color={BrandColors.white} />
                <Text style={styles.newCompanyButtonText}>Cadastrar primeira empresa</Text>
              </Pressable>
            </View>
          ) : filteredCompanies.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateTitle}>Nenhuma empresa encontrada</Text>
              <Text style={styles.stateSubtitle}>
                Não encontramos resultados para &ldquo;{searchQuery.trim()}&rdquo;.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.clearSearchButton,
                  pressed && styles.clearSearchButtonPressed,
                ]}
                accessibilityRole="button"
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchButtonText}>Limpar busca</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cardsGrid}>
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  isActive={company.id === activeCompanyId}
                  isUpdatingPrimary={updatingPrimaryId === company.id}
                  onEdit={handleOpenEdit}
                  onSelectActive={handleSelectActive}
                  onSetPrimary={(selected) => {
                    void handleSetPrimary(selected);
                  }}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <CompanyFormModal
        visible={modalVisible}
        company={editingCompany}
        isFirstCompany={companies.length === 0}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.lightGray,
  },
  safeAreaInline: {
    backgroundColor: BrandColors.darkGreen,
  },
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
  principal: {
    paddingTop: 26,
    paddingHorizontal: 39,
    paddingBottom: 40,
    gap: 24,
  },
  principalCompact: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerText: {
    flexShrink: 1,
    minWidth: 220,
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
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 13,
  },
  headerActionsCompact: {
    width: '100%',
  },
  newCompanyButton: {
    height: 43,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.darkGreen,
  },
  newCompanyButtonPressed: {
    backgroundColor: BrandColors.greenHover,
  },
  newCompanyButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.white,
  },

  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 19,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: 220,
    minWidth: 0,
    minHeight: 112,
    padding: 20,
    borderRadius: 18,
    backgroundColor: BrandColors.white,
    gap: 6,
    justifyContent: 'center',
  },
  summaryCardDark: {
    backgroundColor: BrandColors.darkGreen,
  },
  summaryCardLight: {
    backgroundColor: BrandColors.lightGreen,
  },
  summaryLabel: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: BrandColors.textSoft,
  },
  summaryLabelLight: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: 'rgba(232, 234, 229, 0.85)',
  },
  summaryLabelSoftDark: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    color: 'rgba(14, 42, 32, 0.78)',
  },
  summaryValue: {
    fontFamily: FontFamily.title,
    fontSize: 22,
    lineHeight: 28,
    color: BrandColors.text,
  },
  summaryValueLight: {
    fontFamily: FontFamily.title,
    fontSize: 26,
    lineHeight: 32,
    color: BrandColors.white,
  },
  summaryNote: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: BrandColors.textSoft,
  },
  summaryNoteLight: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(232, 234, 229, 0.8)',
  },
  summaryNoteSoftDark: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(14, 42, 32, 0.75)',
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  bannerSuccess: {
    backgroundColor: BrandColors.toReceiveBg,
  },
  bannerError: {
    backgroundColor: BrandColors.toPayBg,
  },
  bannerText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  bannerTextSuccess: {
    color: BrandColors.toReceiveText,
  },
  bannerTextError: {
    color: BrandColors.toPayText,
  },
  bannerClose: {
    padding: 4,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: BrandColors.white,
  },
  retryButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: BrandColors.toPayText,
  },

  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  searchInput: {
    width: 340,
    maxWidth: '100%',
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
  searchInputCompact: {
    width: '100%',
  },
  countText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    color: BrandColors.textSoft,
  },

  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 19,
  },

  stateCard: {
    borderRadius: 20,
    paddingVertical: 44,
    paddingHorizontal: 24,
    backgroundColor: BrandColors.white,
    alignItems: 'center',
    gap: 12,
  },
  emptyIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: BrandColors.toReceiveBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTitle: {
    fontFamily: FontFamily.title,
    fontSize: 20,
    color: BrandColors.darkGreen,
    textAlign: 'center',
  },
  stateSubtitle: {
    maxWidth: 420,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSoft,
    textAlign: 'center',
  },
  clearSearchButton: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },
  clearSearchButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.darkGreen,
  },
});
