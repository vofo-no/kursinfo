import { EapplyCourse, EapplyDocument } from "./types";

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

export function eapply(tenantId: string) {
  async function fetchSingleRequest(
    path: eApplyPath | string,
    queryParams?: Record<string, string>,
  ) {
    try {
      const response = await fetch(
        `${process.env.EAPPLY_URL}/api/v1/${path}?${new URLSearchParams({
          ...queryParams,
          tenantId,
        })}`,
        {
          ...options,
          signal: AbortSignal.timeout(15000),
        },
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return {
    getAllCoursesInYear: async (year: string): Promise<EapplyCourse[]> => {
      if (!/^\d{4}$/.test(year)) throw "Invalid year";

      return fetchSingleRequest("courses", {
        endDateFrom: `01.01.${year}`,
        endDateTo: `31.12.${year}`,
        limit: "50000",
      });
    },

    getCaseDocuments: async (caseId: string): Promise<EapplyDocument[]> => {
      if (!/^\d+$/.test(caseId)) throw "Invalid caseId";

      return fetchSingleRequest(`cases/${caseId}/documents`);
    },
  };
}
