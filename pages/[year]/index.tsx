import fs from "fs";
import path from "path";

import Link from "next/link";
import Layout from "../../components/Layout";
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
    <Layout title={`Fylkesstatistikk ${year}`}>
      <h1>Fylkesstatistikk {year}</h1>
      <ul>
        {reports.map(([key, value]) => (
          <li key={key}>
            <Link href={`/${year}/${key}`}>{value}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/">Vis alle år</Link>
      </p>
    </Layout>
  );
}
