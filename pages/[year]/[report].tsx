import Report from "components/Report";
import getReportStaticData from "components/Report/getReportStaticData";
import dataIndex from "data/index.json";
import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import path from "path";
import {
  AssociationReportProps,
  ComboReportProps,
  GlobalReportProps,
  RegionReportProps,
  ReportParams,
} from "types/reports";

type PathsType = Array<{ params: ReportParams }>;

export const getStaticProps: GetStaticProps<
  | RegionReportProps
  | AssociationReportProps
  | ComboReportProps
  | GlobalReportProps,
  ReportParams
> = async ({ params }) => {
  if (!params) throw new Error();
  return getReportStaticData(params);
};

export const getStaticPaths: GetStaticPaths<ReportParams> = async () => {
  const paths: PathsType = [];
  dataIndex.years.map((year) => {
    const dataPath = path.join(process.cwd(), `data/${year}.json`);
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8")).reports;
    Object.keys(data).map((report) => {
      paths.push({ params: { year, report } });
    });
  });
  return { paths, fallback: false };
};

export default Report;
