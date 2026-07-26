import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";
import { getTenantDataUrl } from "@vofo-no/kursinfo-lite";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/statistikk/[tenant]/manifest">,
) {
  const { tenant } = await params;

  async function getCachedManifest() {
    "use cache";
    cacheLife("minutes");

    const manifestBlobUrl = getTenantDataUrl(tenant, "manifest");

    const response = await fetch(manifestBlobUrl);
    if (!response.ok) {
      return {};
    }
    return response.json();
  }

  try {
    const manifestData = await getCachedManifest();

    return NextResponse.json(manifestData, {
      headers: {
        "Cache-Control": "no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error(`Error reading statistikk manifest for ${tenant}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
