import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "react-feather";

import { IndexedCourseItem } from "@/types/courses";

import LinkCell from "./LinkCell";

export function cellRender(
  cell: Cell<IndexedCourseItem, unknown>,
  row: Row<IndexedCourseItem>,
) {
  if (cell.getIsGrouped()) {
    if (cell.column.columnDef.meta?.getUrlParams && cell.getValue() !== null) {
      return (
        <LinkCell
          params={cell.column.columnDef.meta?.getUrlParams(cell.getValue())}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </LinkCell>
      );
    } else {
      return (
        <>
          <button
            onClick={row.getToggleExpandedHandler()}
            className="inline-block -ml-1.5 align-middle hover:text-primary-darker"
          >
            {row.getIsExpanded() ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </>
      );
    }
  }

  if (cell.getIsAggregated()) {
    return flexRender(
      cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
      cell.getContext(),
    );
  }

  if (cell.getIsPlaceholder()) {
    return null;
  }

  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
