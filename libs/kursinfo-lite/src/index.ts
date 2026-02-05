import { decompress } from "compress-json";

export interface ITenantData {
  buildTime: string;
  counties: Array<string>;
  countyParams: Array<string>;
  curriculums: Array<string>;
  items: Array<IndexedCourseItem>;
  organizationParams: Array<string>;
  organizations: Array<string>;
  organizers: Array<string>;
  reportSchema?: string;
  useTitleColumn?: boolean;
  showFacilitationGrants?: boolean;
  showGrantsSpecifications?: boolean;
}

export enum CourseStatus {
  PLANNED = 2,
  DONE = 7,
}

export interface IndexedCourseItem {
  countyIndex: number;
  curriculumIndex: number;
  endDate?: string;
  endYear?: string;
  facilitationGrant?: number;
  grant?: number;
  hasTeacher?: boolean;
  hours: number;
  ID: string;
  locationCode: string;
  organizationCode: string;
  organizerIndex: number;
  participants?: number;
  startDate: string;
  status: CourseStatus;
  title: string;
}

export function getTenantDataUrl(tenant: string, year: string) {
  return `https://lg3wcd5gxfh37h0h.public.blob.vercel-storage.com/sf-data/v1/${tenant}/${year}.json`;
}

export async function uncompressTenantData(data: string): Promise<ITenantData> {
  const result = decompress(await JSON.parse(data));
  return result;
}
