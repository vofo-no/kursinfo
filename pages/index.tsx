import WhiteBox from "components/Containers/WhiteBox";
import GridLinks from "components/GridLinks";
import { GetStaticProps } from "next";
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
      <WhiteBox>
        <div className="prose">
          <h1 className="text-4xl mb-0">Statistikk</h1>
          <p>
            Her finner du Vofos nasjonale og regionale statistikkrapporter for
            studieforbundenes kursvirksomhet.
          </p>
        </div>
      </WhiteBox>
      <GridLinks items={years.map((year) => [`/${year}`, year])} />
    </Layout>
  );
};

export default Index;
