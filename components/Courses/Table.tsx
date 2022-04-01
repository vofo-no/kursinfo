import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { FormattedNumber } from "react-intl";
import {
  Cell,
  ColumnInstance,
  Row,
  TableOptions,
  useExpanded,
  useGroupBy,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { CourseStatus, IndexedCourseItem } from "types/courses";

import ArrowDown from "./ArrowDown";
import ArrowRight from "./ArrowRight";
import getExcelFromTable from "./helpers/getExcelFromTable";
import Pagination from "./Pagination";

function Arrow({
  column: { isSorted, isSortedDesc, canSort },
}: {
  column: ColumnInstance<IndexedCourseItem>;
}) {
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
}

function headerA11yProps(column: ColumnInstance<IndexedCourseItem>): {
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

const CellRender = ({
  cell,
  row,
}: {
  cell: Cell<IndexedCourseItem>;
  row: Row<IndexedCourseItem>;
}): JSX.Element | null => {
  if (cell.isGrouped) {
    if (cell.column.makeHref && cell.value !== null) {
      return (
        <Link href={cell.column.makeHref(String(cell.value))}>
          <a>{cell.render("Cell")}</a>
        </Link>
      );
    } else {
      return (
        <>
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <ArrowDown /> : <ArrowRight />}
          </span>{" "}
          {cell.render("Cell")}
        </>
      );
    }
  } else if (cell.isAggregated) {
    return <>{cell.render("Aggregated")}</>;
  } else if (cell.isPlaceholder) {
    return null;
  }
  return <>{cell.render("Cell")}</>;
};

const Table: FC<TableOptions<IndexedCourseItem>> = (props) => {
  const router = useRouter();

  const {
    footerGroups,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    setHiddenColumns,
    state: { expanded, pageIndex, pageSize, groupBy },
    visibleColumns,
    pageOptions,
    gotoPage,
  } = useTable(
    {
      ...props,
      paginateExpandedRows: false,
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination
  );

  const [toggledColumns, setToggledColumns] = useState<Array<string>>([]);

  useEffect(() => {
    setToggledColumns([]);
  }, [groupBy]);

  useEffect(() => {
    if (Object.keys(expanded).length) {
      setHiddenColumns((old) => {
        if (!toggledColumns.length) setToggledColumns(old);
        return [];
      });
    } else {
      if (toggledColumns.length)
        setToggledColumns((old) => {
          setHiddenColumns(old);
          return [];
        });
    }
  }, [expanded, setHiddenColumns, toggledColumns.length]);

  const navToPage = (page: number) => {
    const query: { page?: number } = {
      ...router.query,
      page: page + 1,
    };
    if (page < 1) {
      delete query.page;
    }
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      {
        shallow: true,
      }
    );
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    gotoPage((Number(router.query.page) || 1) - 1);
  }, [gotoPage, router.query.page]);

  const prevPagesRowCount = pageIndex * pageSize + 1;

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...headerGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: headerKey, ...headerProps } =
                    column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th
                      key={headerKey}
                      {...headerProps}
                      {...headerA11yProps(column)}
                    >
                      {column.canSort ? (
                        <div className="flex">
                          <span>{column.render("Header")}</span>
                          <Arrow column={column} />
                        </div>
                      ) : (
                        column.render("Header")
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: Row<IndexedCourseItem>) => {
            prepareRow(row);
            const rowState = row.isGrouped
              ? {}
              : {
                  className:
                    row.original.status === CourseStatus.PLANNED
                      ? "status-planned"
                      : "status-done",
                };
            const { key: rowKey, ...rowProps } = row.getRowProps([rowState]);
            return (
              <tr key={rowKey} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <td
                      key={cellKey}
                      {...cellProps}
                      className={cell.column.className}
                    >
                      <CellRender cell={cell} row={row} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerGroups.map((group) => {
            const { key: footerGroupKey, ...footerGroupProps } =
              group.getFooterGroupProps();
            return (
              <tr key={footerGroupKey} {...footerGroupProps}>
                {group.headers.map((column) => {
                  const { key: footerKey, ...footerProps } =
                    column.getFooterProps();
                  return (
                    <td
                      key={footerKey}
                      {...footerProps}
                      className={column.className}
                    >
                      {column.render("Footer")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tfoot>
      </table>
      {pageOptions.length > 1 ? (
        <div className="flex items-center justify-between my-4 flex-wrap">
          <div>
            Viser{" "}
            <strong>
              <FormattedNumber value={prevPagesRowCount} />
            </strong>{" "}
            til{" "}
            <strong>
              <FormattedNumber
                value={Math.min(prevPagesRowCount + pageSize - 1, rows.length)}
              />
            </strong>{" "}
            av <FormattedNumber value={rows.length} /> rader.
          </div>
          <nav aria-label="Naviger paginering">
            <Pagination
              pageCount={pageOptions.length}
              gotoPage={navToPage}
              pageIndex={pageIndex}
            />
          </nav>
        </div>
      ) : null}
      <button
        className="py-2 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-darker focus:z-10 focus:ring-4 focus:ring-gray-200 print:hidden"
        type="button"
        onClick={() =>
          getExcelFromTable(
            String(router.query.group),
            visibleColumns,
            rows,
            prepareRow
          )
        }
      >
        Lagre som Excel-fil
      </button>
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
        tbody td.status-done,
        tbody tr.status-done {
          background: #d4edda;
        }
        tbody tr:nth-child(odd) td.status-done,
        tbody tr.status-done:nth-child(odd) {
          background: #c3e6cb;
        }
        tbody td.status-planned,
        tbody tr.status-planned {
          background: #fff5d6;
        }
        tbody tr:nth-child(odd) td.status-planned,
        tbody tr.status-planned:nth-child(odd) {
          background: #ffeeba;
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
