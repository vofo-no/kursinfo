"use client";

import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import classNames from "classnames";
import AlertDialog from "components/AlertDialog";
import intl from "lib/intl";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Info } from "react-feather";
import { CourseStatus } from "types/courses";

import { Arrow } from "./Arrow";
import ColumnVisibility from "./ColumnVisibility";
import { CoursesProps, ExtendedICourseItem, GroupType } from "./constants";
import { cellRender } from "./helpers/cellRender";
import {
  aggregatedColumnHelper,
  columnHelper,
  numericColumnHelper,
} from "./helpers/columnHelper";
import getExcelFromTable from "./helpers/getExcelFromTable";
import { getHeaderSortingProps } from "./helpers/getHeaderSortingProps";
import remixISODate from "./helpers/remixISODate";
import Item from "./Item";
import Pagination from "./Pagination";

const statusText: Record<CourseStatus, string> = {
  [CourseStatus.PLANNED]: "Planlagt",
  [CourseStatus.DONE]: "Gjennomført",
};

const groupGroupingStates: Record<string, GroupingState> = {
  organisasjoner: ["organizationCode"],
  lag: ["organizerIndex"],
  fylker: ["countyIndex"],
  studieplaner: ["curriculumIndex"],
};

function getSortingStateFromGroup(group: GroupType): SortingState {
  switch (group) {
    case "lag":
    case "studieplaner":
    case "organisasjoner":
      return [{ id: "agg-hours-7", desc: true }];
    case "fylker":
      return [{ id: "countyIndex", desc: false }];
    default:
      return [{ id: "startDate", desc: false }];
  }
}

function getColumnVisibilityFromGroupingStateAndExpanded(
  grouping: GroupingState,
  isExpanded: boolean,
  useTitleColumn: boolean,
): VisibilityState {
  if (grouping.length) {
    return {
      title: false,
      curriculumIndex: isExpanded || grouping.includes("curriculumIndex"),
      organizationCode: isExpanded || grouping.includes("organizationCode"),
      organizerIndex: isExpanded || grouping.includes("organizerIndex"),
      countyIndex: isExpanded || grouping.includes("countyIndex"),
      startDate: isExpanded,
      endDate: isExpanded,
      status: isExpanded,
      ID: isExpanded,
    };
  } else {
    return {
      organizationCode: false,
      countyIndex: false,
      title: useTitleColumn,
      curriculumIndex: !useTitleColumn,
    };
  }
}

const CoursesTable = ({
  counties,
  countyParams,
  curriculums,
  group,
  items,
  organizations,
  organizers,
  reportSchema,
  useTitleColumn,
}: Pick<
  CoursesProps,
  | "counties"
  | "county"
  | "countyParams"
  | "curriculums"
  | "group"
  | "items"
  | "organization"
  | "organizations"
  | "organizers"
  | "reportSchema"
  | "useTitleColumn"
>): JSX.Element => {
  const tableData = useMemo(() => items, [items]);
  const searchParams = useSearchParams();

  const page = searchParams?.get("page");

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>(
    getSortingStateFromGroup(group),
  );
  const [modal, setModal] = useState<ExtendedICourseItem>();

  const grouping: GroupingState = useMemo(
    () => groupGroupingStates[group] || [],
    [group],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getColumnVisibilityFromGroupingStateAndExpanded(
      grouping,
      false,
      !!useTitleColumn,
    ),
  );

  useEffect(() => {
    setColumnVisibility(
      getColumnVisibilityFromGroupingStateAndExpanded(
        grouping,
        !!Object.keys(expanded).length,
        !!useTitleColumn,
      ),
    );
  }, [grouping, expanded, useTitleColumn]);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: (Number(page) || 1) - 1,
      pageSize: 100,
    }),
    [page],
  );

  const modalCourseHandler = useCallback(
    (newID: string) => {
      const course = tableData.find(({ ID }) => ID === newID);
      if (!course) return setModal(undefined);
      return setModal({
        ...course,
        startDate: remixISODate(course.startDate, true) || "",
        endDate: remixISODate(course.endDate, true) || undefined,
        organizer: organizers[course.organizerIndex],
        curriculum: curriculums[course.curriculumIndex],
      });
    },
    [curriculums, organizers, tableData],
  );

  const getOrganizationName = useCallback(
    (param?: string) =>
      (typeof param === "string" && organizations[Number(param)]) || "(Ukjent)",
    [organizations],
  );

  const getOrganizerName = useCallback(
    (index?: number) =>
      (typeof index === "number" && organizers[index]) || "(Ukjent)",
    [organizers],
  );

  const getCountyName = useCallback(
    (index?: number) =>
      (typeof index === "number" && counties[index]) || "(Ukjent)",
    [counties],
  );

  const getCurriculumName = useCallback(
    (index?: number) =>
      (typeof index === "number" && curriculums[index]) || "(Ukjent)",
    [curriculums],
  );

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("organizationCode", {
        header: "Organisasjon",
        cell: (props) => getOrganizationName(props.getValue()),
        meta: {
          getUrlParams: (param) => ({
            organization: param,
          }),
        },
      }),
      columnHelper.accessor((row) => getOrganizerName(row.organizerIndex), {
        header: "Lokallag",
        id: "organizerIndex",
      }),
      columnHelper.accessor("countyIndex", {
        header: "Fylke",
        cell: (props) => getCountyName(props.getValue()),
        aggregationFn: undefined,
        meta: {
          getUrlParams: (param) => ({
            county: countyParams[Number(param)],
          }),
        },
      }),
      columnHelper.accessor("startDate", {
        header: "Start",
        meta: {
          getPlainValue: (props) => props.getValue(),
        },
        cell: (props) => remixISODate(props.getValue()),
      }),
      columnHelper.accessor("endDate", {
        header: "Slutt",
        meta: {
          getPlainValue: (props) => props.getValue(),
        },
        cell: (props) => remixISODate(props.getValue()),
      }),
      columnHelper.accessor((row) => getCurriculumName(row.curriculumIndex), {
        id: "curriculumIndex",
        header: "Studieplan",
      }),
      columnHelper.accessor("title", {
        header: "Tittel",
      }),
      columnHelper.accessor((row) => statusText[row.status] || null, {
        id: "status",
        header: "Status",
      }),
      columnHelper.accessor("ID", {
        header: "",
        enableSorting: false,
        meta: {
          getPlainValue: (props) => props.getValue(),
        },
        cell: (params) => (
          <button
            className="transparent tight"
            title="Vis kursinformasjon"
            onClick={() => modalCourseHandler(params.getValue())}
          >
            <Info />
          </button>
        ),
        aggregatedCell: () => null,
      }),
    ];

    const allCoursesColumns = [
      numericColumnHelper("hours", "Timer"),
      numericColumnHelper("participants", "Deltakere"),
      numericColumnHelper("grant", "Tilskudd"),
    ];

    const aggColumns = [
      columnHelper.group({
        header: "Gjennomførte",
        columns: [
          aggregatedColumnHelper("ID", "Kurs", CourseStatus.DONE),
          aggregatedColumnHelper("hours", "Timer", CourseStatus.DONE),
          aggregatedColumnHelper(
            "participants",
            "Deltakere",
            CourseStatus.DONE,
          ),
          aggregatedColumnHelper("grant", "Tilskudd", CourseStatus.DONE),
        ],
      }),
      columnHelper.group({
        header: "+ Planlagte",
        id: "planned",
        columns: [
          aggregatedColumnHelper("ID", "Kurs", CourseStatus.PLANNED),
          aggregatedColumnHelper("hours", "Timer", CourseStatus.PLANNED),
        ],
      }),
    ];

    if (group === "kurs") return [...baseColumns, ...allCoursesColumns];
    return [...baseColumns, ...aggColumns];
  }, [
    countyParams,
    getCountyName,
    getCurriculumName,
    getOrganizationName,
    getOrganizerName,
    group,
    modalCourseHandler,
  ]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility, expanded, grouping, pagination, sorting },
    paginateExpandedRows: false,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const prevPagesRowCount = pagination.pageIndex * pagination.pageSize + 1;
  const allPagesRowCount = table.getPrePaginationRowModel().rows.length;

  return (
    <>
      <table className="w-full border-collapse leading-none">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-2 py-1 text-left border-b-gray-500 border-b whitespace-nowrap"
                  colSpan={header.colSpan}
                  {...getHeaderSortingProps(
                    header.column,
                    header.isPlaceholder,
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? `flex gap-1 cursor-pointer ${
                              header.column.columnDef.aggregationFn === "sum"
                                ? "justify-end"
                                : "justify-between"
                            }`
                          : "text-center"
                      }
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      {header.column.getCanSort() && (
                        <Arrow column={header.column} />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white">
          {table.getRowModel().rows.map((row) => {
            const isPlanned =
              !row.getIsGrouped() &&
              row.original.status === CourseStatus.PLANNED;
            const isDone =
              !row.getIsGrouped() && row.original.status === CourseStatus.DONE;
            return (
              <tr key={row.id} className="odd:bg-gray-200 group">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={classNames(
                      "py-1 px-2 border-gray-300 border border-b-0 align-top",
                      {
                        "tabular-nums text-right":
                          cell.column.columnDef.meta?.isNumeric,
                        "group-odd:bg-[#c3e6cb] bg-[#d4edda]":
                          cell.column.columnDef.meta?.isDone || isDone,
                        "group-odd:bg-[#ffeeba] bg-[#fff5d6]":
                          cell.column.columnDef.meta?.isPlanned || isPlanned,
                      },
                    )}
                  >
                    {cellRender(cell, row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <td
                  key={header.id}
                  colSpan={header.colSpan}
                  className={classNames(
                    "py-1 px-2 font-semibold border-t-gray-500 border-t",
                    {
                      "tabular-nums text-right":
                        header.column.columnDef.meta?.isNumeric,
                    },
                  )}
                >
                  {flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      {table.getPageOptions().length > 1 ? (
        <div className="flex items-center justify-between my-4 flex-wrap">
          <div>
            Viser <strong>{intl.formatNumber(prevPagesRowCount)}</strong> til{" "}
            <strong>
              {intl.formatNumber(
                Math.min(
                  prevPagesRowCount + table.getState().pagination.pageSize - 1,
                  allPagesRowCount,
                ),
              )}
            </strong>{" "}
            av {intl.formatNumber(allPagesRowCount)} rader.
          </div>
          <nav aria-label="Naviger paginering">
            <Pagination
              pageCount={table.getPageOptions().length}
              pageIndex={table.getState().pagination.pageIndex}
            />
          </nav>
        </div>
      ) : null}
      <button
        className="py-2 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-darker focus:z-10 focus:border-crimson-300 focus:ring focus:ring-crimson-200 focus:ring-opacity-50 print:hidden"
        type="button"
        onClick={() =>
          getExcelFromTable(
            group,
            table.getVisibleLeafColumns(),
            table.getPrePaginationRowModel().rows,
          )
        }
      >
        Lagre som Excel-fil
      </button>
      <ColumnVisibility columns={table.getAllLeafColumns()} />
      <AlertDialog
        title="Kursinformasjon"
        open={!!modal}
        close={() => setModal(undefined)}
      >
        <Item reportSchema={reportSchema} course={modal} />
      </AlertDialog>
    </>
  );
};

export default CoursesTable;
