import { ITenantData } from "@kursinfo/types";
import { decompress } from "compress-json";

export function getTenantDataUrl(tenant: string, year: string) {
  return `https://lg3wcd5gxfh37h0h.public.blob.vercel-storage.com/sf-data/v1/${tenant}/${year}.json`;
}

export async function uncompressTenantData(data: string): Promise<ITenantData> {
  const result = decompress(await JSON.parse(data));
  return result;
}
