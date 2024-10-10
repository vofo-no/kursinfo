const MAX_LAST_YEAR_MONTH = 2;
const MAX_LAST_YEAR_DATE = 2;

export function afterMaxLastYear() {
  const today = new Date();

  const maxLastYear = new Date(
    today.getFullYear(),
    MAX_LAST_YEAR_MONTH,
    MAX_LAST_YEAR_DATE,
  );

  return today > maxLastYear;
}
