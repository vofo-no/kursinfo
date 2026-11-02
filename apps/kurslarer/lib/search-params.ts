export type RawParams = { [key: string]: string | string[] | undefined };

const list = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

// dedupe + sort, so ?county=A&county=B and ?county=B&county=A share a cache entry
const normalize = (values: string[]) => [...new Set(values)].sort();

export function parseSearch(
  sp: RawParams,
  options: { counties: string[]; organizations: string[] },
) {
  const counties = new Set(options.counties);
  const organizations = new Set(options.organizations);
  return {
    query: list(sp.q)[0]?.trim().slice(0, 100) || undefined,
    county: normalize(list(sp.fylke).filter((c) => counties.has(c))),
    organization: normalize(list(sp.org).filter((o) => organizations.has(o))),
  };
}

export type ParsedSearch = ReturnType<typeof parseSearch>;
