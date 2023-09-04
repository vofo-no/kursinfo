import { Column, Row } from "@tanstack/react-table";
import { Column as ExcelColumn } from "exceljs";
import FileSaver from "file-saver";
import { IndexedCourseItem } from "types/courses";

import { getColumnName } from "./getColumnName";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

function transformColumn(
  column: Column<IndexedCourseItem, unknown>,
): Partial<ExcelColumn> {
  const columnName = getColumnName(column.columnDef.header);
  return {
    header:
      column.parent && column.parent.id === "planned"
        ? `Planlagte ${String(columnName).toLowerCase()}`
        : String(columnName || column.id),
    key: column.id,
    style: { numFmt: "# ##0" },
  };
}

async function getExcelFromTable(
  name: string,
  columns: Array<Column<IndexedCourseItem, unknown>>,
  rows: Array<Row<IndexedCourseItem>>,
): Promise<void> {
  const { Workbook } = await import("exceljs");
  const wb = new Workbook();
  const sheet = wb.addWorksheet();
  sheet.name = `Statistikk ${name}`.trim();
  sheet.columns = columns.map(transformColumn);
  sheet.addRows(
    rows.map((row) => {
      return row.getVisibleCells().map((cell) => {
        if (cell.getIsAggregated()) {
          return cell.getValue();
        } else if (cell.getIsPlaceholder()) {
          return null;
        } else {
          if (typeof cell.column.columnDef.meta?.getPlainValue === "function")
            return cell.column.columnDef.meta.getPlainValue(cell.getContext());

          if (typeof cell.column.columnDef.cell === "function")
            return cell.column.columnDef.cell(cell.getContext());

          return cell.getValue();
        }
      });
    }),
  );

  wb.xlsx.writeBuffer().then((excelBuffer) => {
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, sheet.name + fileExtension);
  });
}

export default getExcelFromTable;
