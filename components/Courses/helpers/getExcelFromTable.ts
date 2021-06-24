import { Column } from "exceljs";
import FileSaver from "file-saver";
import { ColumnInstance, Row } from "react-table";
import { IndexedCourseItem } from "types/courses";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

function transformColumn(
  col: ColumnInstance<IndexedCourseItem>
): Partial<Column> {
  return {
    header:
      col.parent && col.parent.id === "+ Planlagte"
        ? `Planlagte ${String(col.Header || col.id).toLowerCase()}`
        : String(col.Header || col.id),
    key: col.id,
    style: { numFmt: "# ##0" },
  };
}

async function getExcelFromTable(
  name: string,
  columns: Array<ColumnInstance<IndexedCourseItem>>,
  rows: Array<Row<IndexedCourseItem>>,
  prepareRow: (row: Row<IndexedCourseItem>) => void
): Promise<void> {
  const { Workbook } = await import("exceljs");
  const wb = new Workbook();
  const sheet = wb.addWorksheet();
  sheet.name = `Statistikk ${name}`.trim();
  sheet.columns = columns.map(transformColumn);
  sheet.addRows(
    rows.map((row) => {
      prepareRow(row);
      return row.cells.map((cell) => {
        if (cell.column.makeValue) {
          return cell.column.makeValue(cell.value);
        }

        if (cell.isPlaceholder) {
          return null;
        }

        return cell.value;
      });
    })
  );

  wb.xlsx.writeBuffer().then((excelBuffer) => {
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, sheet.name + fileExtension);
  });
}

export default getExcelFromTable;
