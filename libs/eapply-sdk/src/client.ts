import { Sema } from "async-sema";

import { EapplyCourse, EapplyDocument } from "./types";

const LIMIT = 1000;
const LIMIT_MAX = 25_000;
const s = new Sema(25);

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

type eApplyPath = "courses";

export class EapplyClient {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  private async fetchSingleRequest(
    path: eApplyPath | string,
    queryParams?: Record<string, string>,
  ) {
    return fetch(
      `${process.env.EAPPLY_URL}/api/v1/${path}?${new URLSearchParams({
        ...queryParams,
        tenantId: this.tenantId,
      })}`,
      {
        ...options,
        signal: AbortSignal.timeout(15000),
      },
    )
      .catch((res) => res.statusText)
      .then((res) => res.json());
  }

  private async fetchBatchRequests<T>(
    path: eApplyPath,
    queryParams?: Record<string, string>,
    limitMax: number = LIMIT_MAX,
  ) {
    let result: T[] = [];

    for (let offset = 0; offset < limitMax; offset += LIMIT) {
      await s.acquire();

      if (result.length < offset) break;

      try {
        const data = await this.fetchSingleRequest(path, {
          offset: String(offset),
          limit: String(limitMax),
          ...queryParams,
        });

        result.push(...data);
      } finally {
        s.release();
      }
    }

    return result;
  }

  async getAllCoursesInYear(year: string) {
    if (!/^\d{4}$/.test(year)) throw "Invalid year";

    return this.fetchBatchRequests<EapplyCourse>("courses", {
      endDateFrom: `01.01.${year}`,
      endDateTo: `31.12.${year}`,
    });
  }

  async getCaseDocuments(caseId: string): Promise<EapplyDocument[]> {
    if (!/^\d+$/.test(caseId)) throw "Invalid caseId";

    return this.fetchSingleRequest(`cases/${caseId}/documents`);
  }
}
