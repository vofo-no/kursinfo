export function getInitials(str: string) {
  return (
    (str.match(/(^\S\S?|\s\S)?/g) || [])
      .map((v) => v.trim())
      .join("")
      .match(/(^\S|\S$)?/g) || []
  )
    .join("")
    .toLocaleUpperCase();
}
