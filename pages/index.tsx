import { Box } from "@vofo-no/design";
import { GetStaticProps } from "next";
import Link from "next/link";
import { FC } from "react";

import Layout from "../components/Layout";
import PageHeading from "../components/PageHeading";
import dataIndex from "../data/index.json";

interface IndexProps {
  years: Array<string>;
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  return {
    props: {
      years: dataIndex.years,
    },
  };
};

const Index: FC<IndexProps> = ({ years }) => {
  return (
    <Layout title={`Statistikk`} header>
      <Box variant="light" p={3} boxShadow="small">
        <PageHeading>Statistikk</PageHeading>
        <ul>
          {years.map((year) => (
            <li key={year}>
              <Link href={`/${year}`}>
                <a>{year}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Box>
    </Layout>
  );
};

export default Index;
