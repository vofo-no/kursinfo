import { Box } from "@vofo-no/design";
import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "node:querystring";
import path from "path";
import { FC } from "react";

import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import { years } from "../../data/index.json";

interface ReportIndexProps {
  year: string;
  reports: Array<[string, string]>;
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
  return {
    props: {
      year,
      reports: Object.keys(data.reports).map((report) => [
        report,
        String(data.reports[report].name),
      ]),
    },
  };
};

export const getStaticPaths: GetStaticPaths<ReportIndexParams> = async () => {
  return {
    paths: years.map((year) => ({
      params: {
        year,
      },
    })),
    fallback: false,
  };
};

const YearIndex: FC<ReportIndexProps> = ({ year, reports }) => (
  <Layout title={`Statistikk ${year}`} header>
    <Box variant="light" p={3} boxShadow={1}>
      <PageHeading>Statistikk {year}</PageHeading>
      <ul>
        {reports.map(([key, value]) => (
          <li key={key}>
            <Link href={`/${year}/${key}`}>
              <a>{value}</a>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/">
          <a>Vis alle år</a>
        </Link>
      </p>
    </Box>
  </Layout>
);

export default YearIndex;
