import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/nb";

import { Box, Text } from "@vofo-no/design";
import { useRouter } from "next/router";
import { FC } from "react";
import { CoursesParams } from "types/courses";

import { CoursesProps } from "./constants";
import CoursesTable from "./CoursesTable";
import Filter from "./Filter";
import GroupTabs from "./GroupTabs";
import getUrlObject from "./helpers/getUrlObject";

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

const Courses: FC<CoursesProps> = (props) => {
  const { group, organization, county, year, countyOptions } = props;
  const router = useRouter();
  const nav = (query: Partial<CoursesParams> = {}) => {
    router.push(getUrlObject(router, query, { group, organization, county }));
  };
  const setYear = (year: string) => nav({ year });
  const setCounty = (county: string) => nav({ county });
  const setOrganization = (organization: string) => nav({ organization });

  return (
    <>
      <Box as="main" variant="light" container>
        <Box my={3}>
          <Text as="h1">{makeTitle(year, county, countyOptions)}</Text>
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
      </Box>
      <Box variant="dark" py={3}>
        <Box container>Vofo!</Box>
      </Box>
    </>
  );
};

export default Courses;
