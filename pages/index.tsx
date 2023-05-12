import WhiteBox from "components/Containers/WhiteBox";
import GridLinks from "components/GridLinks";
import { GetStaticProps } from "next";
import Image from "next/image";
import { FC } from "react";

import Layout from "../components/Layout";
import dataIndex from "../data/index.json";
import illustration from "../public/undraw_upgrade_re_gano.svg";

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
        </div>
        <div className="flex flex-col tablet:flex-row-reverse">
          <div className="mt-6 tablet:mt-0">
            <Image src={illustration} alt="" />
          </div>
          <div className="prose mt-6">
            <p className="lead">
              Her finner du Vofos nasjonale og regionale statistikkrapporter om
              studieforbundenes kursvirksomhet.
            </p>
            <p>
              Rapportene viser omfanget og utviklingen av tilskuddsberettiget
              kursvirksomhet i ulike studieforbund og fylker. Kilde til
              rapportene er Statistisk sentralbyrå (SSB) sin offisielle
              statistikk over{" "}
              <a href="https://ssb.no/voppl">
                studieforbundenes opplæringsvirksomhet
              </a>
              .
            </p>
          </div>
        </div>
      </WhiteBox>
      <GridLinks items={years.map((year) => [`/${year}`, year])} />
    </Layout>
  );
};

export default Index;
