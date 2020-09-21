import fs from "fs";
import path from "path";

import Link from "next/link";
import { Container } from "vofo-design";
import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import { years } from "../../data/index.json";

export async function getStaticProps({ params: { year } }) {
  const dataPath = path.join(process.cwd(), `data/${year}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return {
    props: {
      year,
      reports: Object.keys(data.reports).map((report) => [
        report,
        data.reports[report].name,
      ]),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: years.map((year) => ({
      params: {
        year,
      },
    })),
    fallback: false,
  };
}

export default function YearIndex({ year, reports }) {
  return (
    <Layout title={`Statistikk ${year}`} header>
      <Container variant="white" my={3} py={3} boxShadow={1}>
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
      </Container>
    </Layout>
  );
}
