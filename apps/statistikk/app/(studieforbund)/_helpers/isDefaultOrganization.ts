import { DEFAULT_ORGANIZATION_PARAM } from "@/lib/constants";

export function isDefaultOrganization(val: string): boolean {
  return val === DEFAULT_ORGANIZATION_PARAM;
}
