import { StudieforbundParams } from "app/(studieforbund)/types";
import { Suspense } from "react";

import SelectCounty from "./SelectCounty";
import SelectOrganization from "./SelectOrganization";
import SelectYear from "./SelectYear";

interface FilterProps {
  params: StudieforbundParams;
  tenant: string;
}

const Filter = async ({ tenant, params }: FilterProps) => {
  return (
    <fieldset className="my-3">
      <legend className="sr-only">Filter</legend>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectYear year={params.year} tenant={tenant} />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectOrganization
          organization={params.organization}
          year={params.year}
          tenant={tenant}
        />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectCounty county={params.county} year={params.year} />
      </Suspense>
    </fieldset>
  );
};

export default Filter;
