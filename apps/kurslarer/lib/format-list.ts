export function formatList(list: string[], options?: Intl.ListFormatOptions) {
  return `${new Intl.ListFormat("no", { ...options }).format(list)}`;
}
