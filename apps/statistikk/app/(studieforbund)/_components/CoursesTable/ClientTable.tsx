"use client";

import React, { useMemo, useState } from "react";
import { ITenantData } from "@vofo-no/kursinfo-lite";

import { ExtendedICourseItem } from "@/app/(studieforbund)/_components/CoursesTable/constants";
import remixISODate from "@/app/(studieforbund)/_helpers/remixISODate";
import { SummableIndexedCourseItem } from "@/app/(studieforbund)/_utils/sumTableData";

import getColumns from "./getColumns";
import TableCore from "./table-core";

interface Props extends ITenantData {
  group: string;
  sums: SummableIndexedCourseItem;
  page: string | null;
}

export default function ClientTable({
  items,
  counties,
  countyParams,
  curriculums,
  organizations,
  organizers,
  page,
  group,
  reportSchema,
  sums,
  useTitleColumn,
}: Props) {
  const [modal, setModal] = useState<ExtendedICourseItem>();

  const columns = useMemo(
    () =>
      getColumns({
        countyParams,
        group,
        sums,
        modalCourseHandler: (newID: string) => {
          const course = items.find(({ ID }) => ID === newID);
          if (!course) return setModal(undefined);
          setModal({
            ...course,
            startDate: remixISODate(course.startDate, true) || "",
            endDate: remixISODate(course.endDate, true) || undefined,
            organizer: organizers[course.organizerIndex] || "",
            curriculum: curriculums[course.curriculumIndex] || "",
          });
        },
        getOrganizationName: (param?: string) =>
          (typeof param === "string" && organizations[Number(param)]) ||
          "(Ukjent)",
        getOrganizerName: (index?: number) =>
          (typeof index === "number" && organizers[index]) || "(Ukjent)",
        getCountyName: (index?: number) =>
          (typeof index === "number" && counties[index]) || "(Ukjent)",
        getCurriculumName: (index?: number) =>
          (typeof index === "number" && curriculums[index]) || "(Ukjent)",
      }),
    [
      countyParams,
      group,
      sums,
      items,
      counties,
      curriculums,
      organizations,
      organizers,
    ],
  );

  return (
    <TableCore
      items={items}
      columns={columns}
      page={page}
      group={group}
      reportSchema={reportSchema}
      useTitleColumn={useTitleColumn}
      modal={modal}
      onCloseModal={() => setModal(undefined)}
    />
  );
}
