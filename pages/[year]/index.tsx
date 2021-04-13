import { Box, Text } from "@vofo-no/design";
import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "node:querystring";
import path from "path";
import { FC } from "react";
import { ASSOCIATION, COMBO, GLOBAL, REGION } from "types/reports";

import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
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
  <Link href={url}>
    <a style={{ textDecoration: "none" }}>
      <Text
        py={2}
        px={3}
        as="span"
        display="block"
        fontWeight={bold ? "bold" : "normal"}
      >
        {title}
      </Text>
    </a>
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
    <Box variant="light" p={3} boxShadow="small">
      <PageHeading>Statistikk {year}</PageHeading>
      <p>
        Her finner du statistikkrapporter for {year}.{" "}
        <Link href="/">
          <a>(Velg et annet år)</a>
        </Link>
      </p>
    </Box>
    <Box
      display="grid"
      gridTemplateColumns={["1fr", "1fr 1fr"]}
      gridGap={3}
      mt={3}
    >
      <div>
        <Box variant="light" boxShadow="small">
          <Box px={3}>
            <Text as="h2" my={0}>
              Fylker
            </Text>
            <p>Kursvirksomheten i de ulike fylkene og hele landet.</p>
          </Box>
          <ul className="link-list">
            {regionReports.map(([key, value]) => (
              <li key={key}>
                <ListLinkItem url={`/${year}/${key}`} title={value} />
              </li>
            ))}
            {globalReports.map(([key, value]) => (
              <li key={key}>
                <ListLinkItem url={`/${year}/${key}`} title={value} bold />
              </li>
            ))}
          </ul>
        </Box>
      </div>
      <div>
        <Box variant="light" boxShadow="small">
          <Box px={3}>
            <Text as="h2" my={0}>
              Studieforbund
            </Text>
            <p>Kursvirksomheten i de ulike studieforbundene.</p>
          </Box>
          <ul className="link-list">
            {associationReports.map(([key, value]) => (
              <li key={key}>
                <ListLinkItem url={`/${year}/${key}`} title={value} />
              </li>
            ))}
            {comboReports.map(([key, value]) => (
              <li key={key}>
                <ListLinkItem url={`/${year}/${key}`} title={value} bold />
              </li>
            ))}
          </ul>
        </Box>
      </div>
    </Box>
    <style jsx>{`
      ul.link-list {
        padding: 0;
        margin: 0;
      }
      ul.link-list li {
        list-style: none;
        padding: 0;
        margin: 0;
        border-top: 1px solid silver;
      }
      ul.link-list li a {
        text-decoration: none;
      }
    `}</style>
  </Layout>
);

export default YearIndex;
