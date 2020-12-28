import Link from "next/link";
import { Box } from "@vofo-no/design";
import Layout from "../components/Layout";
import PageHeading from "../components/PageHeading";
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
}
