/**
 * Format a number into BRL currency (R$ 0,00).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

const PT_BR_MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/**
 * Formats a date as "outubro de 2026" (pt-BR), used in the dashboard subtitle.
 */
export function formatMonthYear(date: Date): string {
  return `${PT_BR_MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

/**
 * Format a CNPJ digits string (00.000.000/0001-00).
 */
export function formatCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}
