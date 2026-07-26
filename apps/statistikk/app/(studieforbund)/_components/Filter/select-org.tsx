"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";

import { DEFAULT_ORGANIZATION_PARAM } from "@/lib/constants";

import { FilterProps } from ".";
import { useStatistikkQuery } from "../../_hooks/use-statistikk-query";
import { mergeOrganizationParams } from "../../_utils/merge-organization-params";
import { StudieforbundParams } from "../../types";
import Select from "./Select";

export function SelectOrganization({ tenant }: Pick<FilterProps, "tenant">) {
  const { year } = useParams<StudieforbundParams>();
  const { data } = useStatistikkQuery({ year, tenant });

  const organizations = useMemo(() => {
    if (data?.organizations.length) {
      return mergeOrganizationParams(
        data.organizations,
        data.organizationParams,
      );
    }
    return [];
  }, [data]);

  const organizationOptions: [string, string][] = [
    [DEFAULT_ORGANIZATION_PARAM, "Alle organisasjoner"],
    ...organizations,
  ];

  return (
    <Select
      aria-label="Velg organisasjon"
      options={organizationOptions}
      propName="organization"
    />
  );
}
