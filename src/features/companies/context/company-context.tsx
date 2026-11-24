import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Company, CompanyPayload } from '../types';
import {
  createCompany as createCompanyRequest,
  getCompanyErrorMessage,
  listCompanies,
  readStoredActiveCompanyId,
  setPrimaryCompany as setPrimaryCompanyRequest,
  updateCompany as updateCompanyRequest,
  writeStoredActiveCompanyId,
} from '../service';

export const COMPANIES_QUERY_KEY = ['companies'] as const;

export interface CompanyContextValue {
  companies: Company[];
  activeCompany: Company | null;
  primaryCompany: Company | null;
  activeCompanyId: string | null;
  setActiveCompanyId: (companyId: string) => void;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  reloadCompanies: () => Promise<void>;
  createCompany: (payload: CompanyPayload) => Promise<Company>;
  updateCompany: (id: string, payload: CompanyPayload) => Promise<Company>;
  setPrimaryCompany: (id: string) => Promise<Company[]>;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export interface CompanyProviderProps {
  children: ReactNode;
}

/**
 * Estado global de empresas e empresa ativa compartilhado entre Web e Mobile
 * (base para F4.2, F4.3, F4.4, F4.6, F5.1, F5.3 e F5.5).
 */
export function CompanyProvider({ children }: CompanyProviderProps) {
  const queryClient = useQueryClient();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(() =>
    readStoredActiveCompanyId()
  );

  const companiesQuery = useQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: listCompanies,
  });

  const companies = useMemo(() => companiesQuery.data ?? [], [companiesQuery.data]);

  const primaryCompany = useMemo(
    () => companies.find((company) => company.isPrimary) ?? companies[0] ?? null,
    [companies]
  );

  const activeCompany = useMemo(() => {
    if (companies.length === 0) return null;
    if (selectedCompanyId) {
      const selected = companies.find((company) => company.id === selectedCompanyId);
      if (selected) return selected;
    }
    return primaryCompany ?? companies[0] ?? null;
  }, [companies, primaryCompany, selectedCompanyId]);

  const activeCompanyId = activeCompany?.id ?? null;

  useEffect(() => {
    if (activeCompanyId) {
      writeStoredActiveCompanyId(activeCompanyId);
    }
  }, [activeCompanyId]);

  const setActiveCompanyId = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId);
    writeStoredActiveCompanyId(companyId);
  }, []);

  const createMutation = useMutation({
    mutationFn: (payload: CompanyPayload) => createCompanyRequest(payload),
    onSuccess: async (created) => {
      const refreshed = await listCompanies();
      queryClient.setQueryData(COMPANIES_QUERY_KEY, refreshed);
      if (refreshed.length === 1 || created.isPrimary) {
        setActiveCompanyId(created.id);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CompanyPayload }) =>
      updateCompanyRequest(id, payload),
    onSuccess: async () => {
      const refreshed = await listCompanies();
      queryClient.setQueryData(COMPANIES_QUERY_KEY, refreshed);
    },
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (id: string) => setPrimaryCompanyRequest(id),
    onSuccess: (updatedCompanies) => {
      queryClient.setQueryData(COMPANIES_QUERY_KEY, updatedCompanies);
    },
  });

  const reloadCompanies = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
  }, [queryClient]);

  const createCompany = useCallback(
    (payload: CompanyPayload) => createMutation.mutateAsync(payload),
    [createMutation]
  );

  const updateCompany = useCallback(
    (id: string, payload: CompanyPayload) => updateMutation.mutateAsync({ id, payload }),
    [updateMutation]
  );

  const setPrimaryCompany = useCallback(
    (id: string) => setPrimaryMutation.mutateAsync(id),
    [setPrimaryMutation]
  );

  const isMutating =
    createMutation.isPending || updateMutation.isPending || setPrimaryMutation.isPending;

  const error = companiesQuery.error ? getCompanyErrorMessage(companiesQuery.error) : null;

  const value = useMemo<CompanyContextValue>(
    () => ({
      companies,
      activeCompany,
      primaryCompany,
      activeCompanyId,
      setActiveCompanyId,
      isLoading: companiesQuery.isLoading,
      isMutating,
      error,
      reloadCompanies,
      createCompany,
      updateCompany,
      setPrimaryCompany,
    }),
    [
      companies,
      activeCompany,
      primaryCompany,
      activeCompanyId,
      setActiveCompanyId,
      companiesQuery.isLoading,
      isMutating,
      error,
      reloadCompanies,
      createCompany,
      updateCompany,
      setPrimaryCompany,
    ]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

/**
 * Hook global para acessar a lista de empresas, a empresa principal e a empresa ativa.
 */
export function useCompanies(): CompanyContextValue {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanies deve ser utilizado dentro de um CompanyProvider.');
  }
  return context;
}
