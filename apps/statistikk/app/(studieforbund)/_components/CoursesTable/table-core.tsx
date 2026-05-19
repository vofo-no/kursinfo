"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ExpandedState,
  functionalUpdate,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ITenantData } from "@vofo-no/kursinfo-lite";

import { formatNumber } from "@/lib/intl";
import AlertDialog from "@/components/AlertDialog";
import { ExtendedICourseItem } from "@/app/(studieforbund)/_components/CoursesTable/constants";
import Item from "@/app/(studieforbund)/_components/CoursesTable/Item";
import Pagination from "@/app/(studieforbund)/_components/Pagination";
import getExcelFromTable from "@/app/(studieforbund)/_helpers/getExcelFromTable";

import ColumnVisibility from "./ColumnVisibility";
import Table from "./Table";

const groupGroupingStates: Record<string, GroupingState> = {
  organisasjoner: ["organizationCode"],
  lag: ["organizerIndex"],
  fylker: ["countyIndex"],
  studieplaner: ["curriculumIndex"],
};

function getSortingStateFromGroup(group: string): SortingState {
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
  expanded: ExpandedState,
  useTitleColumn: boolean = false,
): VisibilityState {
  if (grouping.length) {
    const isExpanded = !!Object.keys(expanded).length;
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

interface TableCoreProps {
  items: ITenantData["items"];
  columns: ColumnDef<ITenantData["items"][number]>[];
  page: string | null;
  group: string;
  reportSchema: ITenantData["reportSchema"];
  useTitleColumn?: boolean;
  modal: ExtendedICourseItem | undefined;
  onCloseModal: () => void;
}

export default function TableCore({
  items,
  columns,
  page,
  group,
  reportSchema,
  useTitleColumn,
  modal,
  onCloseModal,
}: TableCoreProps) {
  const pagination: PaginationState = {
    pageIndex: (Number(page) || 1) - 1,
    pageSize: 100,
  };

  const initialGrouping = groupGroupingStates[group] || [];

  const [grouping, setGrouping] = useState<GroupingState>(initialGrouping);
  const [sorting, setSorting] = useState<SortingState>(
    getSortingStateFromGroup(group),
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getColumnVisibilityFromGroupingStateAndExpanded(
      initialGrouping,
      {},
      useTitleColumn,
    ),
  );
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const expandedChangeHandler: OnChangeFn<ExpandedState> = (updater) => {
    const nextExpanded = functionalUpdate(updater, expanded);
    setExpanded(nextExpanded);
    setColumnVisibility(
      getColumnVisibilityFromGroupingStateAndExpanded(
        grouping,
        nextExpanded,
        useTitleColumn,
      ),
    );
  };

  const table = useReactTable({
    data: items,
    columns,
    paginateExpandedRows: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    // TODO: watch https://github.com/TanStack/table/issues/5026
    onPaginationChange: () => undefined,
    onSortingChange: setSorting,
    onExpandedChange: expandedChangeHandler,
    state: {
      grouping,
      columnVisibility,
      sorting,
      expanded,
      pagination,
    },
  });

  const prevPagesRowCount = pagination.pageIndex * pagination.pageSize;
  const allPagesRowCount = table.getPrePaginationRowModel().rows.length;
  const currentPageRowCount = table.getRowModel().rows.length;

  return (
    <>
      <Table table={table} />

      {table.getPageOptions().length > 1 ? (
        <div className="flex items-center justify-between my-4 flex-wrap">
          <div>
            Viser <strong>{formatNumber(prevPagesRowCount + 1)}</strong> til{" "}
            <strong>
              {formatNumber(prevPagesRowCount + currentPageRowCount)}
            </strong>{" "}
            av {formatNumber(allPagesRowCount)} rader.
          </div>
          <nav aria-label="Naviger paginering">
            <Pagination
              pageCount={table.getPageCount()}
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
      <AlertDialog title="Kursinformasjon" open={!!modal} close={onCloseModal}>
        <Item reportSchema={reportSchema} course={modal} />
      </AlertDialog>
    </>
  );
}
