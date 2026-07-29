import { NextResponse, type NextRequest } from "next/server";
import { get } from "@vercel/blob";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/statistikk/[tenant]/[year]">,
) {
  const { tenant, year } = await params;

  try {
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
  } catch (error) {
    console.error(`Failed to pipe dataset for ${tenant}/${year}:`, error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
