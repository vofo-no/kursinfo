import FileSaver from "file-saver";
import { FC } from "react";
import { Download } from "react-feather";

interface ExportSchemaProps {
  course: {
    ID: string;
    title: string;
    startDate: string;
    hours: number;
    endDate?: string;
    organizer: string;
  };
  reportSchema: string;
}

const ExportSchema: FC<ExportSchemaProps> = ({ course, reportSchema }) => {
  const { ID, title, startDate, hours, endDate, organizer } = course;
  const exportToCSV = (fileName: string) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    fetch(reportSchema)
      .then((response) => response.arrayBuffer())
      .then(async (buffer) => {
        const { Workbook } = await import("exceljs");
        const wbBase = new Workbook();
        wbBase.xlsx.load(buffer).then((wb) => {
          const ws = wb.getWorksheet("Rapport");
          ws.eachRow((row) => {
            row.eachCell((cell) => {
              switch (cell.value?.toString()) {
                case "[title]":
                  cell.value = title;
                  break;
                case "[ID]":
                  cell.value = Number(ID);
                  break;
                case "[organizer]":
                  cell.value = organizer;
                  break;
                case "[hours]":
                  cell.value = `${hours} timer`;
                  break;
                case "[coursePeriod]":
                  cell.value = `${startDate}–${endDate}`;
                  break;
                case "[teacher]":
                  cell.value = ""; // TODO: Fix when available
                  break;
              }
            });
          });

          wb.xlsx.writeBuffer().then((excelBuffer) => {
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
          });
        });
      });
  };

  return (
    <button
      type="button"
      className="py-2 px-5 flex gap-2 items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-darker focus:z-10 focus:ring-4 focus:ring-gray-200"
      tabIndex={0}
      onClick={() => exportToCSV(ID)}
    >
      <Download />
      Last ned rapportskjema
    </button>
  );
};

export default ExportSchema;
