import { ParsedUrlQuery } from "node:querystring";
import {
  AssociationReportProps,
  RegionReportProps,
  TotalReportProps,
} from "types";

export interface ReportParams extends ParsedUrlQuery {
  year: string;
  report: string;
}

export type ReportDataProps =
  | RegionReportProps
  | AssociationReportProps
  | TotalReportProps;
