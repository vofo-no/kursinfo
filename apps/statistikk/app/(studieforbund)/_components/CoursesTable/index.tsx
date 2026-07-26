"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "@/lib/constants";
import { ExtendedICourseItem } from "@/app/(studieforbund)/_components/CoursesTable/constants";
import remixISODate from "@/app/(studieforbund)/_helpers/remixISODate";
import { useStatistikkQuery } from "@/app/(studieforbund)/_hooks/use-statistikk-query";
import sumTableData from "@/app/(studieforbund)/_utils/sumTableData";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

import CoursesTableEmpty from "./CoursesTableEmpty";
import CoursesTableSkeleton from "./CoursesTableSkeleton";
import getColumns from "./getColumns";
import TableCore from "./table-core";

export function CoursesTable({ tenant }: { tenant: string }) {
  const { county, group, organization, year } =
    useParams<StudieforbundParams>();
  const { data, isLoading, isPending, isFetching, error } = useStatistikkQuery({
    year,
    tenant,
  });

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    const countyParamIndex = data.countyParams.indexOf(county);
    return data.items.filter((item) => {
      if (
        county !== DEFAULT_COUNTY_PARAM &&
        countyParamIndex > -1 &&
        item.countyIndex !== countyParamIndex
      ) {
        return false;
      }
      if (
        organization !== DEFAULT_ORGANIZATION_PARAM &&
        item.organizationCode !== organization
      ) {
        return false;
      }
      return true;
    });
  }, [data, county, organization]);

  const sums = useMemo(() => sumTableData(filteredItems), [filteredItems]);

  const [modal, setModal] = useState<ExtendedICourseItem>();

  const columns = useMemo(() => {
    if (!data) return [];
    return getColumns({
      countyParams: data.countyParams,
      group,
      sums,
      modalCourseHandler: (newID: string) => {
        const course = data.items.find(({ ID }) => ID === newID);
        if (!course) return setModal(undefined);
        setModal({
          ...course,
          startDate: remixISODate(course.startDate, true) || "",
          endDate: remixISODate(course.endDate, true) || undefined,
          organizer: data.organizers[course.organizerIndex] || "",
          curriculum: data.curriculums[course.curriculumIndex] || "",
        });
      },
      getOrganizationName: (param?: string) =>
        (typeof param === "string" && data.organizations[Number(param)]) ||
        "(Ukjent)",
      getOrganizerName: (index?: number) =>
        (typeof index === "number" && data.organizers[index]) || "(Ukjent)",
      getCountyName: (index?: number) =>
        (typeof index === "number" && data.counties[index]) || "(Ukjent)",
      getCurriculumName: (index?: number) =>
        (typeof index === "number" && data.curriculums[index]) || "(Ukjent)",
    });
  }, [data, group, sums]);

  if (isLoading || isPending || (isFetching && !data))
    return <CoursesTableSkeleton />;

  if (error || !data || !filteredItems.length) return <CoursesTableEmpty />;

  return (
    <TableCore
      key={group}
      items={filteredItems}
      columns={columns}
      group={group}
      reportSchema={data.reportSchema}
      useTitleColumn={data.useTitleColumn}
      modal={modal}
      onCloseModal={() => setModal(undefined)}
    />
  );
}
