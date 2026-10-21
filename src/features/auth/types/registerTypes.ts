export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpfCnpj: string;
  phone: string;
}

export interface RegisterResponse {
  token: string;
}