import { Suspense } from "react";

import SelectCounty from "./SelectCounty";
import SelectOrganization from "./SelectOrganization";
import SelectYear from "./SelectYear";

interface FilterProps {
  county: string;
  organization: string;
  year: string;
  tenant: string;
}

const Filter = async ({ tenant, year, organization, county }: FilterProps) => {
  return (
    <fieldset className="my-3">
      <legend className="sr-only">Filter</legend>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectYear year={year} tenant={tenant} />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectOrganization
          year={year}
          tenant={tenant}
          organization={organization}
        />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectCounty year={year} county={county} />
      </Suspense>
    </fieldset>
  );
};

export default Filter;
