import { Sema } from "async-sema";

import { EapplyCourse } from "./types";

const LIMIT = 1000;
const LIMIT_MAX = 25_000;

const s = new Sema(25, {
  capacity: LIMIT_MAX / LIMIT + 1,
});

export async function getCoursesByYear(tenantId: string, year: string) {
  let result: EapplyCourse[] = [];
  const credentials = [process.env.EAPPLY_USER, process.env.EAPPLY_TOKEN];

  const headers: HeadersInit = {
    Authorization: `Basic ${Buffer.from(credentials.join(":")).toString(
      "base64",
    )}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method: "GET",
    headers,
  };

  for (let offset = 0; offset < LIMIT_MAX; offset += LIMIT) {
    await s.acquire();

    if (result.length < offset) break;

    const url = `${process.env.EAPPLY_URL}/api/v1/courses?offset=${offset}&limit=${LIMIT}&tenantId=${tenantId}&endDateFrom=01.01.${year}&endDateTo=31.12.${year}`;

    const taskName = `=> Hentet kurs ${offset}-${offset + LIMIT} fra ${tenantId}/${year} i eApply`;
    console.time(taskName);

    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      result.push(...data);
    } finally {
      s.release();
    }

    console.timeEnd(taskName);
  }

  return result;
}
