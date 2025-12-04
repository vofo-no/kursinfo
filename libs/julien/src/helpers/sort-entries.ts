function sortEntriesByValue(entries: Record<string, string>) {
  return Object.entries(entries)
    .sort(([_a, aValue], [_b, bValue]) => aValue.localeCompare(bValue, "nb"))
    .reduce(
      ({ sortedKeys, sortedValues }, [key, value]) => {
        sortedKeys.push(key);
        sortedValues.push(value);
        return { sortedKeys, sortedValues };
      },
      { sortedKeys: [] as string[], sortedValues: [] as string[] },
    );
}
export default sortEntriesByValue;
