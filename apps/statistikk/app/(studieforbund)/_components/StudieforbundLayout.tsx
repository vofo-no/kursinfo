import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import { getTenantData } from "@/lib/get-tenant-data";
import { formatBuildDateTime } from "@/lib/intl";
import Container from "@/components/Containers/Container";
import Footer from "@/components/Containers/Footer";
import WhiteBox from "@/components/Containers/WhiteBox";
import PageHeading from "@/components/PageHeading";

import { mergeOrganizationParams } from "../_utils/merge-organization-params";
import Filter from "./Filter";
import NavigationTabs from "./NavigationTabs";

interface StudieforbundLayoutProps {
  Header: () => React.ReactElement;
  tenant: string;
  tenantName: string;
  contactEmail: string;
  contactUrl: string;
  children: React.ReactNode;
  year: string;
}

export default async function StudieforbundLayout({
  Header,
  tenant,
  tenantName,
  contactEmail,
  contactUrl,
  children,
  year,
}: StudieforbundLayoutProps) {
  const data = await getTenantData(tenant, year);
  if (!data) notFound();

  const { buildTime } = data;
  const organizations = mergeOrganizationParams(
    data.organizations,
    data.organizationParams,
  );

  return (
    <section>
      <Header />
      <main className="my-4">
        <Container noPadding>
          <WhiteBox noPadding>
            <div className="overflow-x-auto print:overflow-x-visible relative">
              <Container>
                <PageHeading>Kursstatistikk {year}</PageHeading>
                <Filter
                  year={year}
                  tenant={tenant}
                  organizations={organizations}
                />
                <Suspense>
                  <NavigationTabs />
                </Suspense>
                <div className="relative">{children}</div>
              </Container>
            </div>
          </WhiteBox>
          <div className="text-right ml-auto mt-2 mr-2 text-xs">
            Sist oppdatert {formatBuildDateTime(Date.parse(buildTime))}
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
}
