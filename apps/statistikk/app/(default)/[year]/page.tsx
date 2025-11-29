import fs from "fs";
import path from "path";
import { Metadata } from "next";
import Link from "next/link";
import dataIndex from "@/data/index.json";

import { ASSOCIATION, COMBO, GLOBAL, REGION } from "@/types/reports";
import WhiteBox from "@/components/Containers/WhiteBox";
import ListLinkItem from "@/components/ListLinkItem";

type ArrayOfStringTuple = Array<[string, string]>;

function getData(year: string) {
  const dataPath = path.join(process.cwd(), `data/${year}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const getReports = (filterBy: string): ArrayOfStringTuple =>
    Object.keys(data.reports)
      .filter((key) => data.reports[key].type === filterBy)
      .map((report): [string, string] => [
        report,
        String(data.reports[report].name),
      ])
      .sort((a, b) => a[1].localeCompare(b[1], "nb"));

  return {
    regionReports: getReports(REGION),
    globalReports: getReports(GLOBAL),
    associationReports: getReports(ASSOCIATION),
    comboReports: getReports(COMBO),
  };
}

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

export function generateStaticParams(): { year: string }[] {
  const years = dataIndex.years;

  return years.map((year) => ({ year }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  return { title: `Statistikk ${params.year}` };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { year } = params;
  const { regionReports, globalReports, associationReports, comboReports } =
    getData(year);

  return (
    <>
      <WhiteBox>
        <div className="prose">
          <h1 className="text-4xl mb-0">Statistikk {year}</h1>
          <p>
            Her finner du statistikkrapporter for {year}.{" "}
            <Link href="/">(Velg et annet år)</Link>
          </p>
        </div>
      </WhiteBox>

      <div className="grid tablet:grid-cols-2 gap-4 mt-4">
        <WhiteBox>
          <div className="prose">
            <h2 className="my-2">Fylker</h2>
            <p>Kursvirksomheten i de ulike fylkene og hele landet.</p>
          </div>
          <ul className="list-none p-0 mt-4 -mx-2 tablet:-mx-6">
            {regionReports.map(([key, value]) => (
              <li key={key} className="border-t-gray-300 border-t">
                <ListLinkItem url={`/${year}/${key}`} title={value} />
              </li>
            ))}
            {globalReports.map(([key, value]) => (
              <li key={key} className="border-t-gray-300 border-t">
                <ListLinkItem url={`/${year}/${key}`} title={value} bold />
              </li>
            ))}
          </ul>
        </WhiteBox>
        <WhiteBox>
          <div className="prose">
            <h2 className="my-2">Studieforbund</h2>
            <p>Kursvirksomheten i de ulike studieforbundene.</p>
          </div>
          <ul className="list-none p-0 mt-4 -mx-2 tablet:-mx-6">
            {associationReports.map(([key, value]) => (
              <li key={key} className="border-t-gray-300 border-t">
                <ListLinkItem url={`/${year}/${key}`} title={value} />
              </li>
            ))}
            {comboReports.map(([key, value]) => (
              <li key={key} className="border-t-gray-300 border-t">
                <ListLinkItem url={`/${year}/${key}`} title={value} bold />
              </li>
            ))}
          </ul>
        </WhiteBox>
      </div>
    </>
  );
}
