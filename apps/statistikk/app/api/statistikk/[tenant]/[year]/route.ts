import { NextResponse } from "next/server";
import { getTenantDataUrl } from "@vofo-no/kursinfo-lite";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/statistikk/[tenant]/[year]">,
) {
  const { tenant, year } = await params;

  try {
    const targetBlobUrl = getTenantDataUrl(tenant, year);

    const blobResponse = await fetch(targetBlobUrl, {
      next: { revalidate: false },
    });

    if (!blobResponse.ok || !blobResponse.body) {
      return NextResponse.json({ error: "Dataset missing" }, { status: 404 });
    }

    return new Response(blobResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`Failed to pipe dataset for ${tenant}/${year}:`, error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
