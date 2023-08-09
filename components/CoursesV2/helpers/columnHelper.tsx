import { CellContext, createColumnHelper } from "@tanstack/react-table";
import classNames from "classnames";
import intl from "lib/intl";
import React from "react";
import { CourseStatus, IndexedCourseItem } from "types/courses";

const numericCellWithStatus = (status: CourseStatus) => {
  const numericCell = (props: CellContext<IndexedCourseItem, unknown>) => {
    const value = props.getValue();
    if (typeof value === "number") {
      return status === CourseStatus.PLANNED ? (
        <PlannedNum value={value} />
      ) : (
        intl.formatNumber(value, { maximumFractionDigits: 0 })
      );
    }
    return null;
  };
  return numericCell;
};

export const columnHelper = createColumnHelper<IndexedCourseItem>();
export function aggregatedColumnHelper(
  accessor: keyof IndexedCourseItem,
  header: string,
  status: CourseStatus,
) {
  return columnHelper.accessor(
    (row) =>
      row.status === status
        ? accessor === "ID"
          ? 1
          : row[accessor]
        : undefined,
    {
      header,
      id: `agg-${accessor}-${status.toString()}`,
      aggregationFn: "sum",
      sortDescFirst: true,
      meta: {
        isNumeric: true,
        isDone: status === CourseStatus.DONE,
        isPlanned: status === CourseStatus.PLANNED,
      },
      cell: numericCellWithStatus(status),
      aggregatedCell: numericCellWithStatus(status),
      footer: (props) => {
        const total = props.table
          .getCoreRowModel()
          .rows.filter((row) => row.original.status === status)
          .reduce((sum, row) => {
            const value = accessor === "ID" ? 1 : row.original[accessor];
            return typeof value === "number" ? value + sum : sum;
          }, 0);

        return status === CourseStatus.PLANNED ? (
          <PlannedNum value={total} />
        ) : (
          intl.formatNumber(total, { maximumFractionDigits: 0 })
        );
      },
    },
  );
}
export function numericColumnHelper(
  accessor: keyof IndexedCourseItem,
  header: string,
) {
  return columnHelper.accessor(accessor, {
    header,
    aggregationFn: "sum",
    sortDescFirst: true,
    meta: {
      isNumeric: true,
      getPlainValue: (props) => props.getValue(),
    },
    cell: (props) => {
      const value = props.getValue();
      if (typeof value === "number") {
        return props.row.getValue("status") === CourseStatus.PLANNED ? (
          <PlannedNum value={value} />
        ) : (
          intl.formatNumber(value, { maximumFractionDigits: 0 })
        );
      }
      return null;
    },
    footer: (props) =>
      props.table
        .getPrePaginationRowModel()
        .rows.reduce<[number, " ", number]>(
          ([sumDone, space, sumPlanned], row) => {
            const value = row.getValue(accessor);
            if (typeof value === "number") {
              if (row.original.status === CourseStatus.PLANNED)
                return [sumDone, space, sumPlanned + value];
              return [sumDone + value, space, sumPlanned];
            }
            return [sumDone, space, sumPlanned];
          },
          [0, " ", 0],
        )
        .map((v, i) => {
          switch (i) {
            default:
              return (
                v && (
                  <React.Fragment key={`${props.column.id}-foot-done`}>
                    {intl.formatNumber(v as number, {
                      maximumFractionDigits: 0,
                    })}
                  </React.Fragment>
                )
              );
            case 1:
              return v;
            case 2:
              return (
                v && (
                  <PlannedNum
                    key={`${props.column.id}-foot-planned`}
                    prefix="(+"
                    value={v as number}
                  />
                )
              );
          }
        })
        .filter(Boolean),
  });
}
function PlannedNum({
  value,
  prefix = "(",
}: {
  value: number;
  prefix?: "(" | "(+";
}): JSX.Element {
  return (
    <>
      <span
        className={classNames(
          {
            "before:content-['(']": prefix === "(",
            "before:content-['(+']": prefix === "(+",
          },
          "after:content-[')'] after:absolute",
        )}
      >
        {intl.formatNumber(value, { maximumFractionDigits: 0 })}
      </span>
    </>
  );
}
