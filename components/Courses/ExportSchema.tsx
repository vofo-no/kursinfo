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
          ws.getCell("A2").value = title;
          ws.getCell("S2").value = Number(ID);
          ws.getCell("A4").value = organizer;
          ws.getCell("M4").value = `${hours} timer`;
          ws.getCell("Q4").value = `${startDate}–${endDate}`;
          ws.getCell("A6").value = ""; // Lærer

          wb.xlsx.writeBuffer().then((excelBuffer) => {
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
          });
        });
      });
  };

  return (
    <button
      style={{ cursor: "pointer" }}
      tabIndex={0}
      onClick={() => exportToCSV(ID)}
    >
      <span>
        <Download />
      </span>
      Last ned rapportskjema
      <style jsx>{`
        button {
          font-size: unset;
          display: flex;
          align-items: center;
          padding: 5px 15px;
        }
        span {
          margin-right: 10px;
        }
      `}</style>
    </button>
  );
};

export default ExportSchema;
