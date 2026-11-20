export const MIN_PASSWORD_LENGTH = 8;

export type CadastroForm = {
  name: string;
  email: string;
  telefone: string;
  CPF: string;
  nomeEmpresa: string;
  nomeFantasia: string;
  negocio: string;
  CNPJ: string;
  emailEmpresa: string;
  password: string;
  confirm: string;
};

export type CadastroErrors = Partial<Record<keyof CadastroForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const onlyDigits =  (value: string) => value.replace(/|D/g, '');

function isValidCPF(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === Number(cpf[10]);
}

function isValidCNPJ(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(cnpj[i]) * weights1[i];
  let rem = sum % 11;
  const digit1 = rem < 2 ? 0 : 11 - rem;
  if (digit1 !== Number(cnpj[12])) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(cnpj[i]) * weights2[i];
  rem = sum % 11;
  const digit2 = rem < 2 ? 0 : 11 - rem;
  return digit2 === Number(cnpj[13]);
}

function isValidPhone(raw: string): boolean {
  const digits = onlyDigits(raw);
  return digits.length === 10 || digits.length === 11;
}

export function validateCadastro(f: CadastroForm): CadastroErrors {
  const e: CadastroErrors = {};

  //Obrigatórios

  if (!f.name.trim()) e.name = 'Campo obrigatório.';

  if (!f.email.trim()) e.email = 'Campo obrigatório.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Informe um e-mail válido.';

  if (!f.nomeEmpresa.trim()) e.nomeEmpresa = 'Campo obrigatório.';

  if (!f.password) e.password = 'Campo obrigatório.';
  else if (f.password.length < MIN_PASSWORD_LENGTH)
    e.password = `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;

  if (!f.confirm) e.confirm = 'Campo obrigatório.';
  else if (f.confirm !== f.password) e.confirm = 'As senhas não coincidem.';
  return e;

  //Opcionais (só valida formato se houver conteúdo)

  if (onlyDigits(f.telefone).length > 0 && !isValidPhone(f.telefone)) {
    e.telefone = 'Informe um telefone válido com DDD.';
  }

  if (onlyDigits(f.CPF).length > 0 && !isValidCPF(f.CPF)) {
    e.CPF = 'Informe um CPF válido.';
  }

  if (onlyDigits(f.CNPJ).length > 0 && !isValidCNPJ(f.CNPJ)) {
    e.CNPJ = 'Informe um CNPJ válido.';
  }

  if (f.emailEmpresa.trim() && !EMAIL_RE.test(f.emailEmpresa.trim())) {
    e.emailEmpresa = 'Informe um e-mail empresarial válido.';
  }

  return e;

}