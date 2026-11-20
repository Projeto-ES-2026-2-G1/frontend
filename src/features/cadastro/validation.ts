export const MIN_PASSWORD_LENGTH = 8;

export type CadastroForm = {
  name: string;
  document: string;
  email: string;
  password: string;
  confirm: string;
};

export type CadastroErrors = Partial<Record<keyof CadastroForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCadastro(f: CadastroForm): CadastroErrors {
  const e: CadastroErrors = {};
  if (!f.name.trim()) e.name = 'Campo obrigatório.';
  if (!f.document.trim()) e.document = 'Campo obrigatório.';
  if (!f.email.trim()) e.email = 'Campo obrigatório.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Informe um e-mail válido.';
  if (!f.password) e.password = 'Campo obrigatório.';
  else if (f.password.length < MIN_PASSWORD_LENGTH)
    e.password = `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (!f.confirm) e.confirm = 'Campo obrigatório.';
  else if (f.confirm !== f.password) e.confirm = 'As senhas não coincidem.';
  return e;
}