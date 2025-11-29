import { Suspense } from "react";

import Container from "@/components/Containers/Container";
import Footer from "@/components/Containers/Footer";
import WhiteBox from "@/components/Containers/WhiteBox";
import PageHeading from "@/components/PageHeading";

import BuildTime from "./BuildTime";
import Filter from "./Filter";
import NavigationTabs from "./NavigationTabs";

export default function StudieforbundLayout({
  Header,
  tenant,
  tenantName,
  contactEmail,
  contactUrl,
}: {
  Header: () => React.ReactElement<any>;
  tenant: string;
  tenantName: string;
  contactEmail: string;
  contactUrl: string;
}) {
  return async function Layout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: Promise<{ year: string }>;
  }) {
    const { year } = await params;
    return (
      <section>
        <Header />
        <main className="my-4">
          <Container noPadding>
            <WhiteBox noPadding>
              <div className="overflow-x-auto print:overflow-x-visible relative">
                <Container>
                  <PageHeading>Kursstatistikk {year}</PageHeading>
                  <Filter year={year} tenant={tenant} />
                  <NavigationTabs />
                  <div className="relative">{children}</div>
                </Container>
              </div>
            </WhiteBox>
            <div className="text-right ml-auto mt-2 mr-2 text-xs">
              <Suspense
                fallback={
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                }
              >
                <BuildTime tenant={tenant} year={year} />
              </Suspense>
            </div>
          </Container>
        </main>
        <Footer>
          <div className="flex tablet:items-end gap-4 flex-col items-center tablet:flex-row">
            <div className="flex-grow">
              <p className="mt-0">
                Statistikk for <strong>{tenantName}</strong>
              </p>
              <p className="text-sm">
                Kontakt studieforbundet:
                <br />
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                <br />
                <a href={contactUrl}>{contactUrl}</a>
              </p>
              <p className="text-sm mb-0">
                Statistikken lages av{" "}
                <a href="http://www.vofo.no">Voksenopplæringsforbundet</a> med
                data fra studieforbundets kurssystem.
              </p>
            </div>
          </div>
        </Footer>
      </section>
    );
  };
}
