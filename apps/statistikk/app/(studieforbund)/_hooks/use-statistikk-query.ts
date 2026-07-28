import { useQuery } from "@tanstack/react-query";
import { uncompressTenantData } from "@vofo-no/kursinfo-lite";

async function fetchAndDecompressDataset(tenant: string, year: string) {
  const response = await fetch(`/api/statistikk/${tenant}/${year}`);
  if (!response.ok) throw new Error("Failed to fetch dataset");

  const structuralCompressedJson = await response.text();
  return uncompressTenantData(structuralCompressedJson);
}

export function useStatistikkQuery({
  year,
  tenant,
}: {
  year: string;
  tenant: string;
}) {
  return useQuery({
    queryKey: ["statistikk", tenant, year],
    queryFn: () => fetchAndDecompressDataset(tenant, year),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
