import { ColumnDef } from "@tanstack/react-table";
import remixISODate from "app/(studieforbund)/_helpers/remixISODate";
import { SummableIndexedCourseItem } from "app/(studieforbund)/_utils/sumTableData";
import React from "react";
import { Info } from "react-feather";
import { CourseStatus, IndexedCourseItem } from "types/courses";

import NumericCell from "./Cells/NumericCell";

const statusText: Record<CourseStatus, string> = {
  [CourseStatus.PLANNED]: "Planlagt",
  [CourseStatus.DONE]: "Gjennomført",
};

function aggregatedColumnHelper(
  accessor: keyof IndexedCourseItem,
  header: string,
  status: CourseStatus,
  sum: number,
): ColumnDef<IndexedCourseItem> {
  const isPlanned = status === CourseStatus.PLANNED;
  return {
    accessorFn: (row) =>
      row.status === status
        ? accessor === "ID"
          ? 1
          : row[accessor]
        : undefined,

    header,
    id: `agg-${accessor}-${status.toString()}`,
    aggregationFn: "sum",
    sortDescFirst: true,
    meta: {
      isNumeric: true,
      isDone: status === CourseStatus.DONE,
      isPlanned,
    },
    cell: ({ getValue }) => (
      <NumericCell value={getValue()} isPlanned={isPlanned} />
    ),
    aggregatedCell: ({ getValue }) => (
      <NumericCell value={getValue()} isPlanned={isPlanned} />
    ),
    footer: () => <NumericCell value={sum} isPlanned={isPlanned} />,
  };
}

function numericColumnHelper(
  accessorKey: keyof IndexedCourseItem,
  header: string,
  sumDone: number,
  sumPlanned: number,
): ColumnDef<IndexedCourseItem> {
  return {
    accessorKey,
    header,
    aggregationFn: "sum",
    sortDescFirst: true,
    meta: {
      isNumeric: true,
      getPlainValue: (props) => props.getValue(),
    },
    cell: ({ getValue, row }) => (
      <NumericCell
        value={getValue()}
        isPlanned={row.getValue("status") === CourseStatus.PLANNED}
      />
    ),
    footer: () => (
      <>
        {sumDone && <NumericCell value={sumDone} />}{" "}
        {sumPlanned && <NumericCell value={sumPlanned} isPlanned isMixed />}
      </>
    ),
  };
}

interface getColumnsProps {
  group: string;
  sums: SummableIndexedCourseItem;
  countyParams: string[];
  getOrganizationName: (param?: string) => string;
  getOrganizerName: (index?: number) => string;
  getCountyName: (index?: number) => string;
  getCurriculumName: (index?: number) => string;
  modalCourseHandler: (newID: string) => void;
}

export default function getColumns({
  countyParams,
  getOrganizationName,
  getOrganizerName,
  getCountyName,
  getCurriculumName,
  modalCourseHandler,
  group,
  sums,
}: getColumnsProps): ColumnDef<IndexedCourseItem>[] {
  const baseColumns: ColumnDef<IndexedCourseItem>[] = [
    {
      accessorKey: "organizationCode",
      header: "Organisasjon",
      cell: (props) => getOrganizationName(props.getValue() as string),
      meta: {
        getUrlParams: (param) => ({
          organization: param,
        }),
      },
    },
    {
      accessorFn: (row) => getOrganizerName(row.organizerIndex),
      header: "Lokallag",
      id: "organizerIndex",
    },
    {
      accessorKey: "countyIndex",
      header: "Fylke",
      cell: (props) => getCountyName(props.getValue() as number),
      aggregationFn: undefined,
      meta: {
        getUrlParams: (param) => ({
          county: countyParams[Number(param)],
        }),
      },
    },
    {
      accessorKey: "startDate",
      header: "Start",
      meta: {
        getPlainValue: (props) => props.getValue(),
      },
      cell: (props) => remixISODate(props.getValue()),
    },
    {
      accessorKey: "endDate",
      header: "Slutt",
      meta: {
        getPlainValue: (props) => props.getValue(),
      },
      cell: (props) => remixISODate(props.getValue()),
    },
    {
      accessorFn: (row) => getCurriculumName(row.curriculumIndex),
      id: "curriculumIndex",
      header: "Studieplan",
    },
    {
      accessorKey: "title",
      header: "Tittel",
    },
    {
      accessorFn: (row) => statusText[row.status] || null,
      id: "status",
      header: "Status",
    },
    {
      accessorKey: "ID",
      header: "",
      enableSorting: false,
      meta: {
        getPlainValue: (props) => props.getValue(),
      },
      cell: (params) => (
        <button
          className="transparent tight"
          title="Vis kursinformasjon"
          onClick={() => modalCourseHandler(params.getValue() as string)}
        >
          <Info />
        </button>
      ),
      aggregatedCell: () => null,
    },
  ];

  const allCoursesColumns: ColumnDef<IndexedCourseItem>[] = [
    numericColumnHelper("hours", "Timer", sums.hours.done, sums.hours.planned),
    numericColumnHelper(
      "participants",
      "Deltakere",
      sums.participants.done,
      sums.participants.planned,
    ),
    numericColumnHelper(
      "grant",
      "Tilskudd",
      sums.grant.done,
      sums.grant.planned,
    ),
  ];

  const aggColumns: ColumnDef<IndexedCourseItem>[] = [
    {
      header: "Gjennomførte",
      columns: [
        aggregatedColumnHelper("ID", "Kurs", CourseStatus.DONE, sums.ID.done),
        aggregatedColumnHelper(
          "hours",
          "Timer",
          CourseStatus.DONE,
          sums.hours.done,
        ),
        aggregatedColumnHelper(
          "participants",
          "Deltakere",
          CourseStatus.DONE,
          sums.participants.done,
        ),
        aggregatedColumnHelper(
          "grant",
          "Tilskudd",
          CourseStatus.DONE,
          sums.grant.done,
        ),
      ],
    },
    {
      header: "+ Planlagte",
      id: "planned",
      columns: [
        aggregatedColumnHelper(
          "ID",
          "Kurs",
          CourseStatus.PLANNED,
          sums.ID.planned,
        ),
        aggregatedColumnHelper(
          "hours",
          "Timer",
          CourseStatus.PLANNED,
          sums.hours.planned,
        ),
      ],
    },
  ];

  /*
  if (showGrantsSpecifications) {
    allCoursesColumns.push(
      numericColumnHelper("facilitationGrant", "Tilretteleggingstilskudd"),
    );
  }
*/
  if (group === "kurs") return [...baseColumns, ...allCoursesColumns];
  return [...baseColumns, ...aggColumns];
}
