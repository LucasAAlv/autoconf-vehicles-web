const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

/** valor_venda comes from the API as a decimal string, e.g. "129900.00". */
export function formatCurrency(value: string): string {
  return currencyFormatter.format(Number(value));
}

export function formatKm(value: number): string {
  return `${numberFormatter.format(value)} km`;
}
