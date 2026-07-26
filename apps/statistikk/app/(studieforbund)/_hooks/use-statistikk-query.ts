import { useQuery } from "@tanstack/react-query";
import { uncompressTenantData } from "@vofo-no/kursinfo-lite";

function useStatistikkManifest(tenant: string) {
  return useQuery({
    queryKey: ["statistikk-manifest", tenant],
    queryFn: async () => {
      const res = await fetch(`/api/statistikk/${tenant}/manifest`, {
        cache: "no-store",
      });
      return res.json() as Promise<Record<string, number>>;
    },
    staleTime: 1000 * 60 * 15,
  });
}

async function fetchAndDecompressDataset(url: string) {
  const response = await fetch(url);
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
  const { data: manifest } = useStatistikkManifest(tenant);

  const lastUpdated = manifest?.[year] || 0;

  return useQuery({
    queryKey: ["statistikk", tenant, year, lastUpdated],
    queryFn: () =>
      fetchAndDecompressDataset(
        `/api/statistikk/${tenant}/${year}?v=${lastUpdated}`,
      ),
    enabled: !!manifest,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
