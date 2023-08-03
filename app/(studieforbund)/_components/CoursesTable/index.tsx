import { GroupType } from "components/CoursesV2/constants";
import CoursesTable from "components/CoursesV2/CoursesTable";
import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "lib/constants";
import getTenantData from "lib/getTenantData";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

import CoursesTableEmpty from "./CoursesTableEmpty";
import CoursesTableSkeleton from "./CoursesTableSkeleton";

interface Props {
  year: string;
  county: string;
  group: string;
  organization: string;
  tenant: string;
}

const getData = cache(({ tenant, year, county, organization }: Props) => {
  const data = getTenantData(tenant, year);

  if (county && county !== DEFAULT_COUNTY_PARAM) {
    const i = data.countyParams.indexOf(county);
    if (i > -1) {
      data.items = data.items.filter(({ countyIndex }) => countyIndex == i);
    }
  }

  if (organization && organization !== DEFAULT_ORGANIZATION_PARAM) {
    data.items = data.items.filter(
      ({ organizationCode }) => organizationCode === organization,
    );
  }

  return data;
});

export default function CoursesTableWrapper({
  year,
  county,
  group,
  organization,
  tenant,
}: Props) {
  const {
    counties,
    countyParams,
    curriculums,
    items,
    organizations,
    organizers,
    reportSchema,
    useTitleColumn,
  } = getData({ year, county, group, organization, tenant }) || notFound();

  return (
    <Suspense fallback={<CoursesTableSkeleton />}>
      {items.length ? (
        <CoursesTable
          {...{
            counties,
            county,
            countyParams,
            curriculums,
            group: group as GroupType,
            items,
            organization,
            organizations,
            organizers,
            reportSchema,
            useTitleColumn,
          }}
        />
      ) : (
        <CoursesTableEmpty />
      )}
    </Suspense>
  );
}
