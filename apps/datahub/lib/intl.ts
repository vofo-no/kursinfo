export const formatDate = new Intl.DateTimeFormat("nb-NO", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const numberFormat = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
});
