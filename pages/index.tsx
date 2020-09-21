import Link from "next/link";
import { Container } from "vofo-design";
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
      <Container variant="white" my={3} py={3} boxShadow={1}>
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
      </Container>
    </Layout>
  );
}
