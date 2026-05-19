const buildDateTimeFormatter = new Intl.DateTimeFormat("nb-NO", {
  timeStyle: "short",
  dateStyle: "medium",
  timeZone: "Europe/Oslo",
});

export function formatBuildDateTime(d: number | Date | undefined) {
  return buildDateTimeFormatter.format(d);
}

const numberFormatter = new Intl.NumberFormat("nb-NO");
const numberFormatterOneFractionDigit = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const numberFormatterNoFractionDigits = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});
export function formatNumber(n: number, digits?: 0 | 1 | undefined) {
  if (digits === 1) return numberFormatterOneFractionDigit.format(n);
  if (digits === 0) return numberFormatterNoFractionDigits.format(n);
  return numberFormatter.format(n);
}
const numberFormatterPercent = new Intl.NumberFormat("nb-NO", {
  style: "percent",
  minimumFractionDigits: 0,
});
export function formatPercent(n: number) {
  return numberFormatterPercent.format(n);
}
