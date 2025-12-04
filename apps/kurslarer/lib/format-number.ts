export function formatNumber(
  number: number | bigint,
  options?: Intl.NumberFormatOptions
) {
  return `${Intl.NumberFormat("no", {
    maximumFractionDigits: 0,
    ...options,
  }).format(number)}`;
}
