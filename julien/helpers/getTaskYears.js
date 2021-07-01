/** Sync last year's data until the end of this month. */
const LAST_YEAR_UNTIL_MONTH = 3;

function getTaskYears() {
  const today = new Date();
  const currYear = today.getFullYear();
  const years = [String(currYear), String(currYear + 1)];
  if (today.getMonth() < LAST_YEAR_UNTIL_MONTH)
    years.unshift(String(currYear - 1));
  return years;
}

module.exports = getTaskYears;
