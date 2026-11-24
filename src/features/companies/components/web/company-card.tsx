import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandColors, FontFamily, formatCnpj } from '@shared';
import type { Company } from '../../types';
import { getCompanyInitials } from '../../validation';
import { CheckIcon, EditIcon, StarIcon } from './icons';

export interface CompanyCardProps {
  company: Company;
  isActive: boolean;
  isUpdatingPrimary: boolean;
  onEdit: (company: Company) => void;
  onSelectActive: (company: Company) => void;
  onSetPrimary: (company: Company) => void;
}

interface DetailItem {
  label: string;
  value: string;
}

/**
 * Cartão individual da listagem de empresas na rota `/empresas`.
 */
export function CompanyCard({
  company,
  isActive,
  isUpdatingPrimary,
  onEdit,
  onSelectActive,
  onSetPrimary,
}: CompanyCardProps) {
  const details: DetailItem[] = [];

  if (company.tradeName) {
    details.push({ label: 'Nome fantasia', value: company.tradeName });
  }
  if (company.businessType) {
    details.push({ label: 'Tipo de negócio', value: company.businessType });
  }
  if (company.cnpj) {
    details.push({ label: 'CNPJ', value: formatCnpj(company.cnpj) });
  }
  if (company.email) {
    details.push({ label: 'E-mail', value: company.email });
  }

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, isActive && styles.avatarActive]}>
          <Text style={[styles.avatarText, isActive && styles.avatarTextActive]}>
            {getCompanyInitials(company.name)}
          </Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.name}>{company.name}</Text>

          <View style={styles.badgesRow}>
            {company.isPrimary && (
              <View style={styles.primaryBadge}>
                <StarIcon size={12} color={BrandColors.white} filled />
                <Text style={styles.primaryBadgeText}>Principal</Text>
              </View>
            )}

            {isActive && (
              <View style={styles.activeBadge}>
                <CheckIcon size={12} color={BrandColors.toReceiveText} />
                <Text style={styles.activeBadgeText}>Ativa no cabeçalho</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {details.length > 0 ? (
        <View style={styles.detailsGrid}>
          {details.map((item) => (
            <View key={item.label} style={styles.detailCell}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDetailsText}>
          Nenhum dado complementar informado. Clique em editar para completar o cadastro.
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${company.name}`}
          onPress={() => onEdit(company)}
        >
          <EditIcon size={15} color={BrandColors.darkGreen} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </Pressable>

        {!isActive && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.activateButton,
              pressed && styles.activateButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Definir ${company.name} como empresa ativa`}
            onPress={() => onSelectActive(company)}
          >
            <CheckIcon size={15} color={BrandColors.toReceiveText} />
            <Text style={styles.activateButtonText}>Usar como ativa</Text>
          </Pressable>
        )}

        {!company.isPrimary && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.primaryActionButton,
              pressed && !isUpdatingPrimary && styles.primaryActionButtonPressed,
              isUpdatingPrimary && styles.actionButtonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Definir ${company.name} como empresa principal`}
            disabled={isUpdatingPrimary}
            onPress={() => onSetPrimary(company)}
          >
            {isUpdatingPrimary ? (
              <ActivityIndicator size="small" color={BrandColors.white} />
            ) : (
              <StarIcon size={15} color={BrandColors.white} />
            )}
            <Text style={styles.primaryActionButtonText}>
              {isUpdatingPrimary ? 'Atualizando...' : 'Definir como principal'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 340,
    minWidth: 0,
    borderRadius: 20,
    padding: 22,
    gap: 16,
    backgroundColor: BrandColors.white,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: BrandColors.lightGreen,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: BrandColors.toReceiveBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarActive: {
    backgroundColor: BrandColors.darkGreen,
  },
  avatarText: {
    fontFamily: FontFamily.title,
    fontSize: 16,
    color: BrandColors.darkGreen,
  },
  avatarTextActive: {
    color: BrandColors.white,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  name: {
    fontFamily: FontFamily.title,
    fontSize: 19,
    lineHeight: 24,
    color: BrandColors.text,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: BrandColors.darkGreen,
  },
  primaryBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    color: BrandColors.white,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: BrandColors.toReceiveBg,
  },
  activeBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    color: BrandColors.toReceiveText,
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
  },
  detailCell: {
    flexGrow: 1,
    flexBasis: 160,
    minWidth: 0,
    gap: 2,
  },
  detailLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: BrandColors.textSoft,
  },
  detailValue: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.text,
  },
  noDetailsText: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.textSoft,
  },

  actions: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: BrandColors.white,
  },
  actionButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },
  actionButtonDisabled: {
    opacity: 0.65,
  },
  actionButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: BrandColors.darkGreen,
  },
  activateButton: {
    borderColor: BrandColors.lightGreen,
    backgroundColor: BrandColors.toReceiveBg,
  },
  activateButtonPressed: {
    opacity: 0.85,
  },
  activateButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: BrandColors.toReceiveText,
  },
  primaryActionButton: {
    borderColor: BrandColors.darkGreen,
    backgroundColor: BrandColors.darkGreen,
  },
  primaryActionButtonPressed: {
    backgroundColor: BrandColors.greenHover,
  },
  primaryActionButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: BrandColors.white,
  },
});
