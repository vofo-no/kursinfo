import config from "../julien/settings.json";

function getTenantName(tenantId: string): string {
  return (
    config.tenants.find(({ dataTarget }) => dataTarget === tenantId)?.name ||
    tenantId
  );
}

export default getTenantName;
