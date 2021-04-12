import { Box } from "@vofo-no/design";
import GridLinks from "components/GridLinks";
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
        <p>
          Her finner du Vofos nasjonale og regionale statistikkrapporter for
          studieforbundenes opplæringsvirksomhet.
        </p>
      </Box>
      <GridLinks items={years.map((year) => [`/${year}`, year])} />
    </Layout>
  );
};

export default Index;
