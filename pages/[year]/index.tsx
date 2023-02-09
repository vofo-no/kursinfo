import WhiteBox from "components/Containers/WhiteBox";
import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import path from "path";
import { ParsedUrlQuery } from "querystring";
import { FC } from "react";
import { ASSOCIATION, COMBO, GLOBAL, REGION } from "types/reports";

import Layout from "../../components/Layout";
import dataIndex from "../../data/index.json";

type ArrayOfStringTuple = Array<[string, string]>;

interface ReportIndexProps {
  year: string;
  regionReports: ArrayOfStringTuple;
  globalReports: ArrayOfStringTuple;
  associationReports: ArrayOfStringTuple;
  comboReports: ArrayOfStringTuple;
}

interface ReportIndexParams extends ParsedUrlQuery {
  year: string;
}

export const getStaticProps: GetStaticProps<
  ReportIndexProps,
  ReportIndexParams
> = async ({ params }) => {
  if (!params) throw new Error();
  const { year } = params;
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
    props: {
      year,
      regionReports: getReports(REGION),
      globalReports: getReports(GLOBAL),
      associationReports: getReports(ASSOCIATION),
      comboReports: getReports(COMBO),
    },
  };
};

export const getStaticPaths: GetStaticPaths<ReportIndexParams> = async () => {
  return {
    paths: dataIndex.years.map((year) => ({
      params: {
        year,
      },
    })),
    fallback: false,
  };
};

const ListLinkItem: FC<{ url: string; title: string; bold?: boolean }> = ({
  url,
  title,
  bold = false,
}) => (
  <Link href={url} className="no-underline">
    <span className={`block px-2 tablet:px-6 py-2 ${bold ? "font-bold" : ""}`}>
      {title}
    </span>
  </Link>
);

const YearIndex: FC<ReportIndexProps> = ({
  year,
  regionReports,
  globalReports,
  comboReports,
  associationReports,
}) => (
  <Layout title={`Statistikk ${year}`} header>
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
  </Layout>
);

export default YearIndex;
