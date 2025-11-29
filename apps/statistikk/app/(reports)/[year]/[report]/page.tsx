import fs from "fs";
import path from "path";
import { Metadata } from "next";
import dataIndex from "@/data/index.json";

import { ReportPropsType } from "@/types/reports";
import Report from "@/components/Report";
import getReportStaticData from "@/components/Report/getReportStaticData";

interface PageProps {
  params: Promise<{
    year: string;
    report: string;
  }>;
}

export function generateStaticParams(): { year: string; report: string }[] {
  const paths: { year: string; report: string }[] = [];
  const years = dataIndex.years;

  years.map((year) => {
    const dataPath = path.join(process.cwd(), `data/${year}.json`);
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8")).reports;
    Object.keys(data).map((report) => {
      paths.push({ year, report });
    });
  });
  return paths;
}

export const dynamicParams = false;

function getTitleFromData({ type, name, year }: ReportPropsType) {
  switch (type) {
    case "ASSOCIATION":
      return `${name}: Studieforbundstatistikk ${year}`;
    case "COMBO":
      return `${name}: Kursstatistikk ${year}`;
    case "GLOBAL":
      return `${name}: Kursstatistikk ${year}`;
    case "REGION":
      return `${name}: Fylkesstatistikk ${year}`;
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const data = getReportStaticData(params);

  const title = getTitleFromData(data);

  return { title };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const data = getReportStaticData(params);

  return <Report {...data} />;
}
