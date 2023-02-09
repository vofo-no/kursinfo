import Container from "components/Containers/Container";
import Footer from "components/Containers/Footer";
import WhiteBox from "components/Containers/WhiteBox";
import FooterSponsor from "components/FooterSponsor";
import PageHeading from "components/PageHeading";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormattedDate } from "react-intl";
import { CoursesParams } from "types/courses";

import { CoursesProps } from "./constants";
import CoursesTable from "./CoursesTable";
import Filter from "./Filter";
import GroupTabs, { tabs } from "./GroupTabs";
import getUrlObject from "./helpers/getUrlObject";
import { unsetSpecific } from "./helpers/unsetSpecific";
import LoadingIndicator from "./LoadingIndicator";

function makeTitle(
  year: string,
  county: string,
  countyOptions: Array<Array<string>>
) {
  const parts = [
    `Kursstatistikk ${year}`,
    (countyOptions.slice(1).find((el) => el[0] === county) || [])[1],
  ];
  return parts.filter(Boolean).join(", ");
}

const Courses = (
  props: CoursesProps & { contactEmail: string; contactUrl: string }
): JSX.Element => {
  const {
    group,
    organization,
    county,
    year,
    countyOptions,
    contactEmail,
    contactUrl,
    tenantName,
    buildTime,
  } = props;
  const router = useRouter();
  const nav = (query: Partial<CoursesParams> = {}) => {
    router.push(
      getUrlObject(router.pathname, router.query, query, {
        group,
        organization,
        county,
      })
    );
  };
  const setYear = (year: string) => nav({ year });
  const setCounty = (county: string) => nav({ county });
  const setOrganization = (organization: string) => nav({ organization });

  const propsTabIndex = tabs.indexOf(group) || 0;
  const [tabIndex, setTabIndex] = useState(propsTabIndex);

  // Update tabIndex on prop change.
  useEffect(() => {
    setTabIndex(propsTabIndex);
  }, [propsTabIndex]);

  // Update state and navigate on change.
  function setTabIndexAndNavigate(newTabIndex: number) {
    setTabIndex(newTabIndex);
    nav({
      group: tabs[newTabIndex],
      ...unsetSpecific(tabs[newTabIndex], { organization, county }),
    });
  }

  const isLoadingISR = tabIndex !== propsTabIndex;

  const title = makeTitle(year, county, countyOptions);

  return (
    <>
      <Head>
        <title>{`${title} - ${tenantName}`}</title>
      </Head>
      <main className="my-4">
        <Container noPadding>
          <WhiteBox noPadding>
            <div className="overflow-x-auto print:overflow-x-visible relative">
              <Container>
                <PageHeading>{title}</PageHeading>
                <Filter
                  {...props}
                  setCounty={setCounty}
                  setYear={setYear}
                  setOrganization={setOrganization}
                />
                <GroupTabs
                  tabIndex={tabIndex}
                  setTabIndex={setTabIndexAndNavigate}
                >
                  <div className="relative">
                    <CoursesTable {...props} />
                    <LoadingIndicator delay={100} show={isLoadingISR} />
                  </div>
                </GroupTabs>
                <style jsx global>
                  {`
                    button.transparent {
                      background: transparent;
                      border: 0;
                      cursor: pointer;
                    }
                    button.tight {
                      border-radius: 50%;
                      padding: 0;
                      line-height: 0;
                    }
                    button.transparent:hover,
                    button.transparent:focus {
                      background: lightgray;
                    }
                    button.transparent:active {
                      color: gray;
                    }
                  `}
                </style>
              </Container>
            </div>
          </WhiteBox>
          <div className="text-right ml-auto mt-2 mr-2 text-xs">
            Sist oppdatert{" "}
            <FormattedDate
              value={Date.parse(buildTime)}
              timeStyle="short"
              dateStyle="medium"
              timeZone="Europe/Oslo"
            />
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
          <div className="flex-shrink-0 not-prose">
            <FooterSponsor />
          </div>
        </div>
      </Footer>
    </>
  );
};

export default Courses;
