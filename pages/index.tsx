import fs from "fs";
import path from "path";

import Link from "next/link";
import Layout from "../components/Layout";
import { years } from "../data/index.json";

export async function getStaticProps() {
  return {
    props: {
      years,
    },
  };
}

export default function Index({ years }) {
  return (
    <Layout title={`Fylkesstatistikk`}>
      <h1>Fylkesstatistikk</h1>
      <ul>
        {years.map((year) => (
          <li key={year}>
            <Link href={`/${year}`}>{year}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
