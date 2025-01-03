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

export function monthKeyToFormat(monthKey: string) {
  const keyParts = monthKey.split("-");
  const d = new Date(Number(keyParts[0]), Number(keyParts[1]) - 1, 1);

  return monthFormat.format(d);
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

export function getDates() {
  const today = new Date();

  return [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ].map((d) => addMonths(today, -d));
}
