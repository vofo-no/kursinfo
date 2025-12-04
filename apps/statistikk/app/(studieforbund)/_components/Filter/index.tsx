import React, { Suspense } from "react";

import SelectCounty from "./SelectCounty";
import SelectOrganization from "./SelectOrganization";
import SelectYear from "./SelectYear";

interface FilterProps {
  year: string;
  tenant: string;
}

const Filter = async ({ tenant, year }: FilterProps) => {
  return (
    <fieldset className="my-3">
      <legend className="sr-only">Filter</legend>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectYear tenant={tenant} />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectOrganization year={year} tenant={tenant} />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 inline-block"></div>
        }
      >
        <SelectCounty year={year} />
      </Suspense>
    </fieldset>
  );
};

export default Filter;
