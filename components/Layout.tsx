import { Logo } from "@vofo-no/ui";
import Head from "next/head";
import { PropsWithChildren } from "react";

import Container from "./Containers/Container";
import Footer from "./Containers/Footer";
import FooterSponsor from "./FooterSponsor";
import Header from "./Header";
import SuperHeader from "./SuperHeader";

interface LayoutProps {
  title: string;
  header?: boolean;
}

export default function Layout(props: PropsWithChildren<LayoutProps>) {
  const { title, children, header = false } = props;
  const LayoutHead = (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  if (header)
    return (
      <>
        {LayoutHead}
        <SuperHeader />
        <Header />
        <main className="my-4">
          <Container noPadding>{children}</Container>
        </main>
        <Footer>
          <div className="text-center">
            Statistikkbank for{" "}
            <a href="https://www.vofo.no/">Voksenopplæringsforbundet</a>
          </div>
          <FooterSponsor />
        </Footer>
      </>
    );

  return (
    <>
      {LayoutHead}
      <main style={{ counterReset: "tables figures" }}>{children}</main>
      <footer className="bg-gray-200 p-2 py-8">
        <div className="max-w-fit mx-auto print:m-0 print:w-full print:max-w-none flex flex-wrap gap-4">
          <div className="prose prose-sm">
            <p>
              Voksenopplæringsforbundet (Vofo) er studieforbundenes
              interesseorganisasjon, nasjonalt og regionalt. Vårt hovedmål er å
              styrke studieforbundenes rammevilkår i arbeidet med å gi voksne
              læringsmuligheter.
            </p>
            <p>
              Du kan lære mer om studieforbund og bli bedre kjent med oss på{" "}
              <a href="https://www.vofo.no">vofo.no</a>.
            </p>
          </div>
          <div>
            <Logo className="w-40" />
          </div>
        </div>
      </footer>
    </>
  );
}
