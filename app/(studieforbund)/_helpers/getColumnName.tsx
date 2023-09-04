export function getColumnName(headerFunc: unknown) {
  if (!headerFunc) return null;
  return typeof headerFunc === "function" ? headerFunc() : headerFunc;
}
