import { NextResponse, type NextRequest } from "next/server";
import { afterMaxLastYear } from "@kursinfo/julien";
import { get } from "@vercel/blob";
import { getTenantDataUrl } from "@vofo-no/kursinfo-lite";

// Return true if year is actively maintained by daily sync tasks.
function isLiveYear(year: string) {
  const today = new Date();
  const currentYear = today.getFullYear();

  return Number(year) >= currentYear + (afterMaxLastYear() ? 0 : -1);
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/statistikk/[tenant]/[year]">,
) {
  const { tenant, year } = await params;

  try {
    if (isLiveYear(year)) {
      const targetBlobUrl = `sf-data/v1/${tenant}/${year}.json`;

      const result = await get(targetBlobUrl, {
        access: "public",
        useCache: false,
        ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
      });

      if (!result) {
        return NextResponse.json({ error: "Dataset missing" }, { status: 404 });
      }

      if (result.statusCode === 304) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            ETag: result.blob.etag,
            "Cache-Control": "public, no-cache",
          },
        });
      }

      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": "application/json",
          ETag: result.blob.etag,
          "Cache-Control": "public, no-cache",
        },
      });
    }

    // Frozen year — cache forever, only ever invalidated by a manual fix
    const tag = `sf:${tenant}:${year}`;
    const blobResponse = await fetch(getTenantDataUrl(tenant, year), {
      next: { revalidate: false, tags: [tag] },
    });

    if (!blobResponse.ok || !blobResponse.body) {
      return NextResponse.json({ error: "Dataset missing" }, { status: 404 });
    }

    return new Response(blobResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Vercel-Cache-Tag": tag,
      },
    });
  } catch (error) {
    console.error(`Failed to pipe dataset for ${tenant}/${year}:`, error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
