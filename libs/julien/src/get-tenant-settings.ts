import settings from "./settings.json";

const allTargets = settings.tenants.map((tenant) => tenant.dataTarget);

export function getTenantSettings(dataTarget: string) {
  const tenant = settings.tenants.find(
    (tenant) => tenant.dataTarget === dataTarget,
  );

  return tenant;
}

export function hasTenant(dataTarget: string) {
  return allTargets.includes(dataTarget);
}
