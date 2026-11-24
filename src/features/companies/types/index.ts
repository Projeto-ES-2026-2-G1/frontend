export interface Company {
  id: string;
  name: string;
  tradeName: string | null;
  businessType: string | null;
  cnpj: string | null;
  email: string | null;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyPayload {
  name: string;
  tradeName?: string | null;
  businessType?: string | null;
  cnpj?: string | null;
  email?: string | null;
  isPrimary: boolean;
}

export interface CompanyFormValues {
  name: string;
  tradeName: string;
  businessType: string;
  cnpj: string;
  email: string;
  isPrimary: boolean;
}

export interface CompanyFormErrors {
  name?: string;
  cnpj?: string;
  email?: string;
}
