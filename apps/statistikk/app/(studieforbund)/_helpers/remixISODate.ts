function remixISODate(str?: unknown, fullYear = false): string | null {
  if (typeof str !== "string") return null;
  const parts = str.split("-");
  return `${parts[2]}.${parts[1]}.${
    fullYear ? parts[0] : parts[0]?.substring(2)
  }`;
}

export default remixISODate;
