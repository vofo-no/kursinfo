import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/nb";
import "@formatjs/intl-datetimeformat/polyfill";
import "@formatjs/intl-datetimeformat/locale-data/nb";

import { Box, Text } from "@vofo-no/design";
import FooterSponsor from "components/FooterSponsor";
import PageHeading from "components/PageHeading";
import { useRouter } from "next/router";
import { FC } from "react";
import { CoursesParams } from "types/courses";

import { CoursesProps } from "./constants";
import CoursesTable from "./CoursesTable";
import Filter from "./Filter";
import GroupTabs from "./GroupTabs";
import getUrlObject from "./helpers/getUrlObject";

const fullDateTime = new Intl.DateTimeFormat("nb", {
  timeStyle: "short",
  dateStyle: "medium",
});

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

const Courses: FC<
  CoursesProps & { contactEmail: string; contactUrl: string }
> = (props) => {
  const {
    group,
    organization,
    county,
    year,
    countyOptions,
    contactEmail,
    contactUrl,
  } = props;
  const router = useRouter();
  const nav = (query: Partial<CoursesParams> = {}) => {
    router.push(getUrlObject(router, query, { group, organization, county }));
  };
  const setYear = (year: string) => nav({ year });
  const setCounty = (county: string) => nav({ county });
  const setOrganization = (organization: string) => nav({ organization });

  return (
    <>
      <Box as="main" my={2} container>
        <Box variant="light" p={3} boxShadow="small">
          <PageHeading>{makeTitle(year, county, countyOptions)}</PageHeading>
          <Filter
            {...props}
            setCounty={setCounty}
            setYear={setYear}
            setOrganization={setOrganization}
          />
          <GroupTabs
            group={group}
            nav={nav}
            county={county}
            organization={organization}
          >
            <CoursesTable {...props} />
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
        </Box>
        <Text textAlign="right" as="div" ml="auto" mt={2} mr={2} fontSize={1}>
          Sist oppdatert {fullDateTime.format(new Date(props.buildTime))}
        </Text>
      </Box>
      <Box variant="dark" py={3}>
        <Box
          container
          display="grid"
          gridTemplateColumns={["auto", "auto 235px"]}
          alignItems="end"
        >
          <Box px={3}>
            <Text>
              Statistikk for <strong>{props.tenantName}</strong>
            </Text>
            <Text fontSize={1}>
              Kontakt studieforbundet:
              <br />
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <br />
              <a href={contactUrl}>{contactUrl}</a>
            </Text>
            <Text fontSize={1}>
              Kursstatistikken utarbeides av{" "}
              <a href="http://www.vofo.no">Voksenopplæringsforbundet</a> på
              grunnlag av data fra studieforbundets kurssystem.
            </Text>
          </Box>
          <FooterSponsor />
        </Box>
      </Box>
    </>
  );
};

export default Courses;
