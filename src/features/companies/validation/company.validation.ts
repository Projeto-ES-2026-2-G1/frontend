import type { Company, CompanyFormErrors, CompanyFormValues, CompanyPayload } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Extrai apenas os dígitos numéricos de um CNPJ, limitando a 14 caracteres.
 */
export function normalizeCnpjDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 14);
}

/**
 * Aplica máscara progressiva de CNPJ (00.000.000/0000-00) durante a digitação.
 */
export function maskCnpjInput(value: string): string {
  const digits = normalizeCnpjDigits(value);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/**
 * Valida se o e-mail informado possui formato válido.
 */
export function isValidCompanyEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * Valida o formulário de criação/edição de empresa conforme regras da F4.2:
 * - Nome da empresa: obrigatório
 * - CNPJ: opcional; se preenchido, deve conter exatamente 14 dígitos
 * - E-mail da empresa: opcional; se preenchido, deve ter formato válido
 */
export function validateCompanyForm(values: CompanyFormValues): CompanyFormErrors {
  const errors: CompanyFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Informe o nome da empresa.';
  }

  const cnpjDigits = normalizeCnpjDigits(values.cnpj);
  if (values.cnpj.trim().length > 0 && cnpjDigits.length !== 14) {
    errors.cnpj = 'O CNPJ deve conter exatamente 14 dígitos.';
  }

  if (values.email.trim().length > 0 && !isValidCompanyEmail(values.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  return errors;
}

export function hasCompanyFormErrors(errors: CompanyFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/**
 * Converte os valores do formulário no payload normalizado para o serviço/API.
 */
export function toCompanyPayload(values: CompanyFormValues): CompanyPayload {
  const tradeName = values.tradeName.trim();
  const businessType = values.businessType.trim();
  const cnpjDigits = normalizeCnpjDigits(values.cnpj);
  const email = values.email.trim();

  return {
    name: values.name.trim(),
    tradeName: tradeName || null,
    businessType: businessType || null,
    cnpj: cnpjDigits || null,
    email: email || null,
    isPrimary: values.isPrimary,
  };
}

/**
 * Inicializa os valores do formulário a partir de uma empresa existente ou em branco.
 */
export function toCompanyFormValues(
  company?: Company | null,
  defaultPrimary = false
): CompanyFormValues {
  if (!company) {
    return {
      name: '',
      tradeName: '',
      businessType: '',
      cnpj: '',
      email: '',
      isPrimary: defaultPrimary,
    };
  }

  return {
    name: company.name,
    tradeName: company.tradeName ?? '',
    businessType: company.businessType ?? '',
    cnpj: company.cnpj ? maskCnpjInput(company.cnpj) : '',
    email: company.email ?? '',
    isPrimary: company.isPrimary,
  };
}

/**
 * Gera até 2 iniciais para o avatar da empresa no cabeçalho/menu lateral.
 */
export function getCompanyInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'ME';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}
