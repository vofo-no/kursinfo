/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/jsx-key */
import React, { FC, useEffect } from "react";
import {
  ColumnInstance,
  TableOptions,
  useExpanded,
  useGroupBy,
  useSortBy,
  useTable,
} from "react-table";
import { ICourseItem } from "types/courses";

const ArrowLeft = () => (
  <svg viewBox="0 0 10 12" width={10} height={12}>
    <polygon points="2 2, 8 6, 2 10" fill="none" stroke="currentColor" />
  </svg>
);

const ArrowDown = () => (
  <svg viewBox="0 0 10 12" width={10} height={12}>
    <polygon points="1 10, 10 2, 10 10" />
  </svg>
);

const Arrow: FC<{ column: ColumnInstance<ICourseItem> }> = ({
  column: { isSorted, isSortedDesc, canSort },
}) => {
  if (!canSort) return null;
  if (!isSorted)
    return (
      <svg viewBox="0 0 10 14" width="12" height="14">
        <polyline points="1 6, 6 1, 11 6" />
        <polyline points="1 8, 6 13, 11 8" />
      </svg>
    );

  return (
    <svg viewBox="0 0 10 14" width="12" height="14">
      {isSortedDesc ? (
        <polyline points="1 4, 6 13, 11 4" />
      ) : (
        <polyline points="1 12, 6 3, 11 12" />
      )}
    </svg>
  );
};

function headerA11yProps(
  column: ColumnInstance<ICourseItem>
): {
  "aria-sort"?: "descending" | "ascending" | "none";
  tabIndex?: number;
} {
  if (!column.canSort) return {};

  if (!column.isSorted)
    return {
      tabIndex: 0,
      "aria-sort": "none",
    };

  return {
    "aria-sort": column.isSortedDesc ? "descending" : "ascending",
    tabIndex: 0,
  };
}

const Table: FC<TableOptions<ICourseItem>> = (props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    setHiddenColumns,
    prepareRow,
    state: { groupBy, expanded },
  } = useTable(props, useGroupBy, useSortBy, useExpanded);

  useEffect(() => {
    if (groupBy.length && Object.keys(expanded).length) {
      setHiddenColumns(
        [
          "courseTitle",
          "curriculumIndex",
          "organizationIndex",
          "organizerIndex",
          "countyIndex",
          "startDate",
          "endDate",
          "caseNumber",
          "reportStatus",
        ].filter((el) => !groupBy.includes(el))
      );
    } else if (groupBy.length) {
      setHiddenColumns([]);
    } else {
      setHiddenColumns(["plannedCourses", "courses"]);
    }
  }, [groupBy, expanded]);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  {...headerA11yProps(column)}
                >
                  <div className="flex">
                    <span>{column.render("Header")}</span>
                    <Arrow column={column} />
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={cell.column.className}
                    >
                      {cell.isGrouped ? (
                        <>
                          <span
                            tabIndex={0}
                            {...row.getToggleRowExpandedProps()}
                          >
                            {row.isExpanded ? <ArrowDown /> : <ArrowLeft />}
                          </span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : (
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerGroups.map((group) => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map((column) => (
                <td {...column.getFooterProps()} className={column.className}>
                  {column.render("Footer")}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <style jsx>{`
        table {
          border-collapse: collapse;
          line-height: 1;
        }
        td,
        th {
          padding: 4px 8px;
        }
        th {
          text-align: left;
        }
        th[scope="row"] {
          font-weight: normal;
        }
        .num {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        thead th {
          border-bottom: 1px solid gray;
          white-space: nowrap;
        }
        thead th .flex {
          display: flex;
          justify-content: space-between;
        }
        tbody {
          background: #fff;
        }
        tbody tr:nth-child(odd) {
          background: #eee;
        }
        tbody th,
        tbody td {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          vertical-align: top;
        }
        tfoot th,
        tfoot td {
          font-weight: bold;
          border-top: 1px solid gray;
        }
      `}</style>
    </>
  );
};

export default Table;
