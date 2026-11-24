import { isAxiosError } from 'axios';
import { apiClient } from '@shared/api';
import type { Company, CompanyPayload } from '../types';
import { normalizeCnpjDigits } from '../validation';

const COMPANIES_STORAGE_KEY = 'simplimei:companies:v1';
const ACTIVE_COMPANY_STORAGE_KEY = 'simplimei:active-company-id:v1';

const DEFAULT_COMPANIES: Company[] = [
  {
    id: 'company-principal-1',
    name: 'Minha empresa',
    tradeName: null,
    businessType: 'Microempreendedor',
    cnpj: null,
    email: null,
    isPrimary: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

let memoryCompanies: Company[] = DEFAULT_COMPANIES.map((company) => ({ ...company }));
let memoryActiveCompanyId: string | null = DEFAULT_COMPANIES[0].id;

function getApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_API_URL?.trim() ?? '';
}

function hasWebStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Normaliza diferentes convenções de resposta da API (camelCase, snake_case ou PT-BR)
 * para a entidade Company usada no front-end.
 */
function normalizeApiCompany(raw: unknown): Company | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;

  const rawId = record.id ?? record._id;
  const rawName = record.name ?? record.nome ?? record.razaoSocial;

  if ((typeof rawId !== 'string' && typeof rawId !== 'number') || typeof rawName !== 'string') {
    return null;
  }

  const rawCnpj = normalizeOptionalString(record.cnpj);

  return {
    id: String(rawId),
    name: rawName.trim(),
    tradeName: normalizeOptionalString(
      record.tradeName ?? record.trade_name ?? record.nomeFantasia ?? record.nome_fantasia
    ),
    businessType: normalizeOptionalString(
      record.businessType ?? record.business_type ?? record.tipoNegocio ?? record.tipo_negocio
    ),
    cnpj: rawCnpj ? normalizeCnpjDigits(rawCnpj) : null,
    email: normalizeOptionalString(record.email ?? record.companyEmail ?? record.emailEmpresa),
    isPrimary: Boolean(record.isPrimary ?? record.is_primary ?? record.principal),
    createdAt: normalizeOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    updatedAt: normalizeOptionalString(record.updatedAt ?? record.updated_at) ?? undefined,
  };
}

function extractApiList(data: unknown): Company[] {
  const candidates = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).data)
      ? ((data as Record<string, unknown>).data as unknown[])
      : data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).companies)
        ? ((data as Record<string, unknown>).companies as unknown[])
        : data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).empresas)
          ? ((data as Record<string, unknown>).empresas as unknown[])
          : [];

  return candidates
    .map(normalizeApiCompany)
    .filter((item): item is Company => item !== null);
}

function ensureSinglePrimary(companies: Company[], preferredPrimaryId?: string): Company[] {
  if (companies.length === 0) return [];

  let primaryId = preferredPrimaryId;
  if (!primaryId || !companies.some((company) => company.id === primaryId)) {
    const existingPrimary = companies.find((company) => company.isPrimary);
    primaryId = existingPrimary ? existingPrimary.id : companies[0].id;
  }

  return companies.map((company) => ({
    ...company,
    isPrimary: company.id === primaryId,
  }));
}

function readLocalCompanies(): Company[] {
  if (!hasWebStorage()) {
    return memoryCompanies.map((company) => ({ ...company }));
  }

  try {
    const stored = window.localStorage.getItem(COMPANIES_STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANIES));
      return DEFAULT_COMPANIES.map((company) => ({ ...company }));
    }

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return DEFAULT_COMPANIES.map((company) => ({ ...company }));
    }

    const normalized = parsed
      .map(normalizeApiCompany)
      .filter((item): item is Company => item !== null);

    return ensureSinglePrimary(normalized);
  } catch {
    return memoryCompanies.map((company) => ({ ...company }));
  }
}

function writeLocalCompanies(companies: Company[]): Company[] {
  const normalized = ensureSinglePrimary(companies);
  memoryCompanies = normalized.map((company) => ({ ...company }));

  if (hasWebStorage()) {
    try {
      window.localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // Ignora erro de quota/privacidade mantendo estado em memória.
    }
  }

  return normalized;
}

export function readStoredActiveCompanyId(): string | null {
  if (!hasWebStorage()) return memoryActiveCompanyId;

  try {
    return window.localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
  } catch {
    return memoryActiveCompanyId;
  }
}

export function writeStoredActiveCompanyId(companyId: string | null): void {
  memoryActiveCompanyId = companyId;

  if (!hasWebStorage()) return;

  try {
    if (companyId) {
      window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, companyId);
    } else {
      window.localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY);
    }
  } catch {
    // Ignora erro de storage.
  }
}

/**
 * Converte erros de rede ou de API em mensagens claras para o usuário.
 */
export function getCompanyErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const apiMessage = record.message ?? record.error ?? record.detail;
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        return apiMessage;
      }
      if (Array.isArray(apiMessage) && apiMessage.length > 0 && typeof apiMessage[0] === 'string') {
        return apiMessage[0];
      }
    }

    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }

    return 'Não foi possível concluir a operação com a empresa. Tente novamente.';
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado ao gerenciar as empresas.';
}

function generateLocalCompanyId(): string {
  return `company-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Lista todas as empresas cadastradas pelo usuário.
 * Usa a API quando `EXPO_PUBLIC_API_URL` está configurada e mantém persistência
 * local desacoplada enquanto o back-end das rotas de empresas está em construção.
 */
export async function listCompanies(): Promise<Company[]> {
  const baseURL = getApiBaseUrl();
  if (baseURL) {
    const response = await apiClient.get<unknown>('/companies', { baseURL });
    return ensureSinglePrimary(extractApiList(response.data));
  }

  return readLocalCompanies();
}

/**
 * Cria uma nova empresa. Caso `isPrimary` seja verdadeiro (ou seja a primeira empresa),
 * desmarca a empresa principal anterior.
 */
export async function createCompany(payload: CompanyPayload): Promise<Company> {
  const baseURL = getApiBaseUrl();
  if (baseURL) {
    const response = await apiClient.post<unknown>('/companies', payload, { baseURL });
    const created = normalizeApiCompany(response.data);
    if (!created) {
      throw new Error('Resposta inválida ao cadastrar a empresa.');
    }
    return created;
  }

  const current = readLocalCompanies();
  const now = new Date().toISOString();
  const shouldBePrimary = payload.isPrimary || current.length === 0;

  const created: Company = {
    id: generateLocalCompanyId(),
    name: payload.name.trim(),
    tradeName: payload.tradeName?.trim() || null,
    businessType: payload.businessType?.trim() || null,
    cnpj: payload.cnpj ? normalizeCnpjDigits(payload.cnpj) : null,
    email: payload.email?.trim() || null,
    isPrimary: shouldBePrimary,
    createdAt: now,
    updatedAt: now,
  };

  const next = writeLocalCompanies(
    [...current, created],
  );
  const persisted = shouldBePrimary
    ? writeLocalCompanies(next.map((item) => ({ ...item, isPrimary: item.id === created.id })))
    : next;

  return persisted.find((item) => item.id === created.id) ?? created;
}

/**
 * Atualiza uma empresa existente. Se marcada como principal, desmarca a anterior.
 */
export async function updateCompany(id: string, payload: CompanyPayload): Promise<Company> {
  const baseURL = getApiBaseUrl();
  if (baseURL) {
    const response = await apiClient.put<unknown>(`/companies/${id}`, payload, { baseURL });
    const updated = normalizeApiCompany(response.data);
    if (!updated) {
      throw new Error('Resposta inválida ao atualizar a empresa.');
    }
    return updated;
  }

  const current = readLocalCompanies();
  const existing = current.find((item) => item.id === id);
  if (!existing) {
    throw new Error('Empresa não encontrada.');
  }

  const now = new Date().toISOString();
  const updatedList = current.map((item) => {
    if (item.id !== id) {
      return payload.isPrimary ? { ...item, isPrimary: false } : item;
    }

    return {
      ...item,
      name: payload.name.trim(),
      tradeName: payload.tradeName?.trim() || null,
      businessType: payload.businessType?.trim() || null,
      cnpj: payload.cnpj ? normalizeCnpjDigits(payload.cnpj) : null,
      email: payload.email?.trim() || null,
      isPrimary: payload.isPrimary || existing.isPrimary,
      updatedAt: now,
    };
  });

  const persisted = writeLocalCompanies(
    ensureSinglePrimary(updatedList, payload.isPrimary ? id : undefined)
  );
  return persisted.find((item) => item.id === id) ?? existing;
}

/**
 * Define a empresa informada como principal, desmarcando a principal anterior.
 */
export async function setPrimaryCompany(id: string): Promise<Company[]> {
  const baseURL = getApiBaseUrl();
  if (baseURL) {
    await apiClient.patch<unknown>(`/companies/${id}/primary`, { isPrimary: true }, { baseURL });
    return listCompanies();
  }

  const current = readLocalCompanies();
  if (!current.some((item) => item.id === id)) {
    throw new Error('Empresa não encontrada.');
  }

  const now = new Date().toISOString();
  const updated = current.map((item) => ({
    ...item,
    isPrimary: item.id === id,
    updatedAt: item.id === id || item.isPrimary ? now : item.updatedAt,
  }));

  return writeLocalCompanies(ensureSinglePrimary(updated, id));
}
