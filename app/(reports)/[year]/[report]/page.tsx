import Report from "components/Report";
import getReportStaticData from "components/Report/getReportStaticData";
import dataIndex from "data/index.json";
import fs from "fs";
import { Metadata } from "next";
import path from "path";
import { ReportPropsType } from "types/reports";

interface PageProps {
  params: {
    year: string;
    report: string;
  };
}

export function generateStaticParams(): PageProps["params"][] {
  let paths: PageProps["params"][] = [];
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

export function generateMetadata({ params }: PageProps): Metadata {
  const data = getReportStaticData(params);

  const title = getTitleFromData(data);

  return { title };
}

export default function Page({ params }: PageProps) {
  const data = getReportStaticData(params);

  return <Report {...data} />;
}
