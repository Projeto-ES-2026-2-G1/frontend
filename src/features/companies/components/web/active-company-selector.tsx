import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { BrandColors, FontFamily, formatCnpj } from '@shared';
import { useDisclosure } from '@shared/hooks';
import { useCompanies } from '../../context';
import { getCompanyInitials } from '../../validation';
import { BuildingIcon, CheckIcon, ChevronDownIcon, CloseIcon, StarIcon } from './icons';

export interface ActiveCompanySelectorProps {
  /** Exibe o atalho "Gerenciar empresas" no rodapé do seletor. */
  showManageLink?: boolean;
  /** Em telas compactas (≤800px), ocupa a largura disponível. */
  fullWidth?: boolean;
}

/**
 * Seletor global de empresa ativa exibido no cabeçalho das páginas web.
 * Substitui o texto estático de empresa e orienta filtros e cadastros futuros.
 */
export function ActiveCompanySelector({
  showManageLink = true,
  fullWidth = false,
}: ActiveCompanySelectorProps) {
  const { companies, activeCompany, activeCompanyId, setActiveCompanyId, isLoading } =
    useCompanies();
  const { isOpen, open, close } = useDisclosure(false);

  const label = isLoading
    ? 'Carregando empresas...'
    : activeCompany
      ? activeCompany.name
      : 'Nenhuma empresa';

  const initials = activeCompany ? getCompanyInitials(activeCompany.name) : null;

  function handleSelect(companyId: string) {
    setActiveCompanyId(companyId);
    close();
  }

  function handleOpenManage() {
    close();
    router.push('/empresas');
  }

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.trigger,
          fullWidth && styles.triggerFullWidth,
          pressed && styles.triggerPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Empresa ativa: ${label}. Clique para trocar.`}
        onPress={open}
      >
        <View style={styles.triggerAvatar}>
          {isLoading ? (
            <ActivityIndicator size="small" color={BrandColors.darkGreen} />
          ) : initials ? (
            <Text style={styles.triggerAvatarText}>{initials}</Text>
          ) : (
            <BuildingIcon size={15} color={BrandColors.darkGreen} />
          )}
        </View>

        <View style={styles.triggerInfo}>
          <Text style={styles.triggerCaption}>Empresa ativa</Text>
          <View style={styles.triggerNameRow}>
            <Text numberOfLines={1} style={styles.triggerName}>
              {label}
            </Text>
            {activeCompany?.isPrimary && (
              <View style={styles.triggerPrimaryDot} accessibilityLabel="Empresa principal" />
            )}
          </View>
        </View>

        <ChevronDownIcon size={18} color={BrandColors.textSoft} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityLabel="Fechar seletor de empresa"
            onPress={close}
          />

          <View style={styles.dialog} accessibilityViewIsModal>
            <View style={styles.dialogHeader}>
              <View style={styles.dialogTitleGroup}>
                <Text style={styles.dialogTitle}>Empresa ativa</Text>
                <Text style={styles.dialogSubtitle}>
                  Escolha qual empresa orienta os filtros e novos cadastros.
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                onPress={close}
              >
                <CloseIcon size={18} color={BrandColors.textSoft} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator
            >
              {companies.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>Nenhuma empresa cadastrada</Text>
                  <Text style={styles.emptySubtitle}>
                    Cadastre sua primeira empresa para selecioná-la como ativa.
                  </Text>
                </View>
              ) : (
                companies.map((company) => {
                  const isSelected = company.id === activeCompanyId;
                  const metaParts = [
                    company.tradeName,
                    company.businessType,
                    company.cnpj ? formatCnpj(company.cnpj) : null,
                  ].filter(Boolean);

                  return (
                    <Pressable
                      key={company.id}
                      style={({ pressed }) => [
                        styles.option,
                        isSelected && styles.optionSelected,
                        pressed && !isSelected && styles.optionPressed,
                      ]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => handleSelect(company.id)}
                    >
                      <View
                        style={[
                          styles.optionAvatar,
                          isSelected && styles.optionAvatarSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionAvatarText,
                            isSelected && styles.optionAvatarTextSelected,
                          ]}
                        >
                          {getCompanyInitials(company.name)}
                        </Text>
                      </View>

                      <View style={styles.optionBody}>
                        <View style={styles.optionHeaderRow}>
                          <Text numberOfLines={1} style={styles.optionName}>
                            {company.name}
                          </Text>
                          {company.isPrimary && (
                            <View style={styles.primaryBadge}>
                              <StarIcon size={11} color={BrandColors.darkGreen} filled />
                              <Text style={styles.primaryBadgeText}>Principal</Text>
                            </View>
                          )}
                        </View>

                        {metaParts.length > 0 && (
                          <Text numberOfLines={1} style={styles.optionMeta}>
                            {metaParts.join(' · ')}
                          </Text>
                        )}
                      </View>

                      <View style={styles.optionCheckSlot}>
                        {isSelected && <CheckIcon size={18} color={BrandColors.darkGreen} />}
                      </View>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>

            {showManageLink && (
              <View style={styles.dialogFooter}>
                <Pressable
                  style={({ pressed }) => [
                    styles.manageButton,
                    pressed && styles.manageButtonPressed,
                  ]}
                  accessibilityRole="button"
                  onPress={handleOpenManage}
                >
                  <BuildingIcon size={16} color={BrandColors.darkGreen} />
                  <Text style={styles.manageButtonText}>Gerenciar empresas</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 43,
    minWidth: 208,
    maxWidth: 280,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    borderRadius: 12,
    backgroundColor: BrandColors.white,
  },
  triggerFullWidth: {
    maxWidth: '100%',
    flexGrow: 1,
  },
  triggerPressed: {
    borderColor: BrandColors.darkGreen,
    backgroundColor: '#F7F9F6',
  },
  triggerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: BrandColors.toReceiveBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  triggerAvatarText: {
    fontFamily: FontFamily.title,
    fontSize: 12,
    color: BrandColors.darkGreen,
  },
  triggerInfo: {
    flex: 1,
    minWidth: 0,
  },
  triggerCaption: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    lineHeight: 12,
    color: BrandColors.textSoft,
  },
  triggerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerName: {
    flexShrink: 1,
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    color: BrandColors.text,
  },
  triggerPrimaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.darkGreen,
    flexShrink: 0,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(14, 42, 32, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '80%',
    borderRadius: 20,
    backgroundColor: BrandColors.white,
    padding: 22,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  dialogTitleGroup: {
    flex: 1,
    gap: 4,
  },
  dialogTitle: {
    fontFamily: FontFamily.title,
    fontSize: 20,
    color: BrandColors.darkGreen,
  },
  dialogSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.textSoft,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },

  list: {
    maxHeight: 320,
  },
  listContent: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BrandColors.lightGray,
    backgroundColor: BrandColors.white,
  },
  optionSelected: {
    borderColor: BrandColors.darkGreen,
    backgroundColor: '#F4F8F2',
  },
  optionPressed: {
    backgroundColor: '#F7F9F6',
  },
  optionAvatar: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: BrandColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionAvatarSelected: {
    backgroundColor: BrandColors.darkGreen,
  },
  optionAvatarText: {
    fontFamily: FontFamily.title,
    fontSize: 14,
    color: BrandColors.darkGreen,
  },
  optionAvatarTextSelected: {
    color: BrandColors.white,
  },
  optionBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionName: {
    flexShrink: 1,
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.text,
  },
  optionMeta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: BrandColors.textSoft,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: BrandColors.toReceiveBg,
  },
  primaryBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    color: BrandColors.toReceiveText,
  },
  optionCheckSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  emptyBox: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    color: BrandColors.text,
  },
  emptySubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    textAlign: 'center',
    color: BrandColors.textSoft,
  },

  dialogFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
  },
  manageButton: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.white,
  },
  manageButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },
  manageButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.darkGreen,
  },
});
