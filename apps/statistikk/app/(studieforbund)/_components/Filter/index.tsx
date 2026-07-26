import React, { Suspense } from "react";
import { getTenantFirstYear } from "@kursinfo/julien";

import { SelectCounty } from "./select-county";
import { SelectOrganization } from "./select-org";
import { SelectYear } from "./select-year";

export interface FilterProps {
  year: string;
  tenant: string;
}

export function Filter({ tenant, year }: FilterProps) {
  const firstYear = getTenantFirstYear(tenant);
  return (
    <fieldset className="my-3">
      <legend className="sr-only">Filter</legend>
      <Suspense>
        <SelectYear firstYear={firstYear} />
      </Suspense>
      <Suspense>
        <SelectOrganization tenant={tenant} />
      </Suspense>
      <Suspense>
        <SelectCounty year={year} />
      </Suspense>
    </fieldset>
  );
}
