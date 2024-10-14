import { getTenantSettings } from "./get-tenant-settings";

export function getTenantId(tenant: string) {
  const { id } = getTenantSettings(tenant) || {};

  return id;
}
