import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BrandColors, FontFamily } from '@shared';
import type {
  Company,
  CompanyFormErrors,
  CompanyFormValues,
  CompanyPayload,
} from '../../types';
import { getCompanyErrorMessage } from '../../service';
import {
  hasCompanyFormErrors,
  maskCnpjInput,
  toCompanyFormValues,
  toCompanyPayload,
  validateCompanyForm,
} from '../../validation';
import { CheckIcon, CloseIcon } from './icons';

export interface CompanyFormModalProps {
  visible: boolean;
  /** Empresa em edição, ou `null` para criação. */
  company: Company | null;
  /** Indica se ainda não há empresas cadastradas (pré-marca como principal). */
  isFirstCompany: boolean;
  onClose: () => void;
  onSubmit: (payload: CompanyPayload) => Promise<void>;
}

interface CompanyFormContentProps {
  company: Company | null;
  isFirstCompany: boolean;
  onClose: () => void;
  onSubmit: (payload: CompanyPayload) => Promise<void>;
}

function CompanyFormContent({
  company,
  isFirstCompany,
  onClose,
  onSubmit,
}: CompanyFormContentProps) {
  const isEditing = company !== null;
  const isCurrentlyPrimary = Boolean(company?.isPrimary);

  const [values, setValues] = useState<CompanyFormValues>(() =>
    toCompanyFormValues(company, isFirstCompany)
  );
  const [errors, setErrors] = useState<CompanyFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof CompanyFormValues | null>(null);

  function handleChange<K extends keyof CompanyFormValues>(
    field: K,
    value: CompanyFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' || field === 'cnpj' || field === 'email') {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  }

  async function handleSave() {
    const nextErrors = validateCompanyForm(values);
    setErrors(nextErrors);

    if (hasCompanyFormErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(toCompanyPayload(values));
      onClose();
    } catch (error) {
      setSubmitError(getCompanyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const primaryToggleLocked = isFirstCompany || isCurrentlyPrimary;

  return (
    <View style={styles.backdrop}>
      <Pressable
        style={StyleSheet.absoluteFill}
        accessibilityLabel="Fechar formulário de empresa"
        onPress={() => {
          if (!isSubmitting) onClose();
        }}
      />

      <View style={styles.modalCard} accessibilityViewIsModal>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isEditing ? 'Editar empresa' : 'Nova empresa'}
            </Text>
            <Text style={styles.subtitle}>
              {isEditing
                ? 'Atualize os dados cadastrais da empresa selecionada.'
                : 'Informe os dados da empresa para organizar contas e lançamentos.'}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Fechar modal"
            disabled={isSubmitting}
            onPress={onClose}
          >
            <CloseIcon size={18} color={BrandColors.textSoft} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {submitError && (
            <View style={styles.errorBanner} accessibilityRole="alert">
              <Text style={styles.errorBannerText}>{submitError}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Nome da empresa <Text style={styles.requiredMark}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'name' && styles.inputFocused,
                Boolean(errors.name) && styles.inputError,
              ]}
              placeholder="Ex.: Studio Criativo Ltda"
              placeholderTextColor="rgba(91, 102, 96, 0.72)"
              value={values.name}
              onChangeText={(text) => handleChange('name', text)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              editable={!isSubmitting}
              accessibilityLabel="Nome da empresa"
            />
            {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Nome fantasia</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'tradeName' && styles.inputFocused,
                ]}
                placeholder="Opcional"
                placeholderTextColor="rgba(91, 102, 96, 0.72)"
                value={values.tradeName}
                onChangeText={(text) => handleChange('tradeName', text)}
                onFocus={() => setFocusedField('tradeName')}
                onBlur={() => setFocusedField(null)}
                editable={!isSubmitting}
                accessibilityLabel="Nome fantasia"
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Tipo de negócio</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'businessType' && styles.inputFocused,
                ]}
                placeholder="Ex.: Serviços, Comércio"
                placeholderTextColor="rgba(91, 102, 96, 0.72)"
                value={values.businessType}
                onChangeText={(text) => handleChange('businessType', text)}
                onFocus={() => setFocusedField('businessType')}
                onBlur={() => setFocusedField(null)}
                editable={!isSubmitting}
                accessibilityLabel="Tipo de negócio"
              />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>CNPJ</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'cnpj' && styles.inputFocused,
                  Boolean(errors.cnpj) && styles.inputError,
                ]}
                placeholder="00.000.000/0000-00"
                placeholderTextColor="rgba(91, 102, 96, 0.72)"
                keyboardType="numeric"
                maxLength={18}
                value={values.cnpj}
                onChangeText={(text) => handleChange('cnpj', maskCnpjInput(text))}
                onFocus={() => setFocusedField('cnpj')}
                onBlur={() => setFocusedField(null)}
                editable={!isSubmitting}
                accessibilityLabel="CNPJ da empresa"
              />
              {errors.cnpj ? (
                <Text style={styles.fieldError}>{errors.cnpj}</Text>
              ) : (
                <Text style={styles.helperText}>Opcional · 14 dígitos se preenchido</Text>
              )}
            </View>

            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>E-mail da empresa</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'email' && styles.inputFocused,
                  Boolean(errors.email) && styles.inputError,
                ]}
                placeholder="contato@empresa.com.br"
                placeholderTextColor="rgba(91, 102, 96, 0.72)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                editable={!isSubmitting}
                accessibilityLabel="E-mail da empresa"
              />
              {errors.email ? (
                <Text style={styles.fieldError}>{errors.email}</Text>
              ) : (
                <Text style={styles.helperText}>Opcional</Text>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.checkboxCard,
              values.isPrimary && styles.checkboxCardActive,
              pressed && !primaryToggleLocked && styles.checkboxCardPressed,
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: values.isPrimary,
              disabled: primaryToggleLocked || isSubmitting,
            }}
            disabled={primaryToggleLocked || isSubmitting}
            onPress={() => handleChange('isPrimary', !values.isPrimary)}
          >
            <View
              style={[
                styles.checkboxBox,
                values.isPrimary && styles.checkboxBoxChecked,
              ]}
            >
              {values.isPrimary && <CheckIcon size={14} color={BrandColors.white} />}
            </View>

            <View style={styles.checkboxTextGroup}>
              <Text style={styles.checkboxTitle}>Definir como empresa principal</Text>
              <Text style={styles.checkboxDescription}>
                {isCurrentlyPrimary
                  ? 'Esta já é a sua empresa principal atual. Para alterar, defina outra empresa como principal.'
                  : isFirstCompany
                    ? 'Sua primeira empresa será marcada automaticamente como principal.'
                    : values.isPrimary
                      ? 'A empresa principal anterior será desmarcada ao salvar.'
                      : 'A empresa principal é usada como referência padrão da conta.'}
              </Text>
            </View>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={onClose}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && !isSubmitting && styles.primaryButtonPressed,
              isSubmitting && styles.primaryButtonDisabled,
            ]}
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSave}
          >
            {isSubmitting && <ActivityIndicator size="small" color={BrandColors.white} />}
            <Text style={styles.primaryButtonText}>
              {isSubmitting
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar alterações'
                  : 'Cadastrar empresa'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/**
 * Modal de criação e edição de empresa (F4.2) com validação de campos
 * obrigatórios/opcionais e tratamento de erros retornados pela API.
 */
export function CompanyFormModal({
  visible,
  company,
  isFirstCompany,
  onClose,
  onSubmit,
}: CompanyFormModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {visible && (
        <CompanyFormContent
          key={company?.id ?? 'new-company'}
          company={company}
          isFirstCompany={isFirstCompany}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(14, 42, 32, 0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '90%',
    borderRadius: 22,
    backgroundColor: BrandColors.white,
    padding: 24,
    gap: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: FontFamily.title,
    fontSize: 22,
    color: BrandColors.darkGreen,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSoft,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },

  formScroll: {
    flexShrink: 1,
  },
  formContent: {
    gap: 15,
    paddingBottom: 4,
  },
  errorBanner: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: BrandColors.toPayBg,
  },
  errorBannerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.toPayText,
  },
  rowFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  halfField: {
    flexGrow: 1,
    flexBasis: 230,
    minWidth: 0,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.text,
  },
  requiredMark: {
    color: BrandColors.toPayText,
  },
  input: {
    height: 46,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    borderRadius: 12,
    backgroundColor: BrandColors.white,
    fontFamily: FontFamily.body,
    fontSize: 15,
    color: BrandColors.text,
  },
  inputFocused: {
    borderColor: BrandColors.darkGreen,
    boxShadow: '0 0 0 3px rgba(151, 191, 138, 0.4)',
  },
  inputError: {
    borderColor: BrandColors.toPayText,
  },
  helperText: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: BrandColors.textSoft,
  },
  fieldError: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: BrandColors.toPayText,
  },

  checkboxCard: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BrandColors.lightGray,
    backgroundColor: '#F8FAF7',
  },
  checkboxCardActive: {
    borderColor: BrandColors.lightGreen,
    backgroundColor: '#F1F7EE',
  },
  checkboxCardPressed: {
    opacity: 0.9,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxBoxChecked: {
    borderColor: BrandColors.darkGreen,
    backgroundColor: BrandColors.darkGreen,
  },
  checkboxTextGroup: {
    flex: 1,
    gap: 3,
  },
  checkboxTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.text,
  },
  checkboxDescription: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 17,
    color: BrandColors.textSoft,
  },

  footer: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BrandColors.lightGray,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BrandColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.white,
  },
  secondaryButtonPressed: {
    backgroundColor: BrandColors.lightGray,
  },
  secondaryButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.text,
  },
  primaryButton: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.darkGreen,
  },
  primaryButtonPressed: {
    backgroundColor: BrandColors.greenHover,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: BrandColors.white,
  },
});
