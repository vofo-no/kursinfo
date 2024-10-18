function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

export const monthFormat = new Intl.DateTimeFormat("nb", {
  year: "numeric",
  month: "long",
});

export function getMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const today = new Date();

export const dates = [
  addMonths(today, -1),
  addMonths(today, -2),
  addMonths(today, -3),
  addMonths(today, -4),
  addMonths(today, -5),
  addMonths(today, -6),
  addMonths(today, -7),
  addMonths(today, -8),
  addMonths(today, -9),
  addMonths(today, -10),
];
