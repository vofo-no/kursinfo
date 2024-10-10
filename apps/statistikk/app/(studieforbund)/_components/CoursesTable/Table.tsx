import { flexRender, Table as ITable } from "@tanstack/react-table";
import classNames from "classnames";

import { CourseStatus, IndexedCourseItem } from "@/types/courses";
import { Arrow } from "@/app/(studieforbund)/_components/CoursesTable/Arrow";
import { cellRender } from "@/app/(studieforbund)/_components/CoursesTable/Cells/cellRender";
import { getHeaderSortingProps } from "@/app/(studieforbund)/_helpers/getHeaderSortingProps";

type Props = {
  table: ITable<IndexedCourseItem>;
};

export default function Table({ table }: Props) {
  const headerGroups = table.getHeaderGroups();
  const footerGroups = table.getFooterGroups();

  return (
    <table className="w-full border-collapse leading-none">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-2 py-1 text-left border-b-gray-500 border-b whitespace-nowrap"
                colSpan={header.colSpan}
                {...getHeaderSortingProps(header.column, header.isPlaceholder)}
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
            !row.getIsGrouped() && row.original.status === CourseStatus.PLANNED;
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
        {footerGroups.map((footerGroup) => (
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
  );
}
