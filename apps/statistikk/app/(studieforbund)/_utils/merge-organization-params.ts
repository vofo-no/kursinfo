export function mergeOrganizationParams(
  organizations: string[] = [],
  organizationParams: string[] = [],
) {
  return organizationParams.map<[string, string]>((item) => [
    item,
    organizations[Number(item)] || item,
  ]);
}
