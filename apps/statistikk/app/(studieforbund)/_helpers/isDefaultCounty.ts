import { DEFAULT_COUNTY_PARAM } from "@/lib/constants";

export function isDefaultCounty(val: string): boolean {
  return val === DEFAULT_COUNTY_PARAM;
}
