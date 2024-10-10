import intl from "@/lib/intl";

import ReportPage from "../ReportPage";
import Table, { TableRow } from "../Table";
import Graph from "./Graph";

type Historical = {
  courses: number[];
  participants: number[];
  hours: number[];
};

interface PropTypes {
  counties: {
    name: string;
    courses: number;
    participants: number;
    hours: number;
    coursesPerCapita: number;
    isCurrent: boolean;
  }[];
  historical: Historical;
  historicalAll?: Historical;
  year: string;
  name: string;
  totalUnit?: "hele landet" | "alle studieforbund";
}

const Counties = ({
  counties,
  year,
  name,
  historical,
  historicalAll,
  totalUnit,
}: PropTypes) => (
  <>
    <ReportPage color="bg-amber-100" title="Kurs i hele landet">
      <Table
        title="Kursoversikt for alle fylker"
        subtitle={`Antall kurs, timer og deltakere per fylke etter kurs pr. 1 000
        innbyggere i ${year}`}
        columns={[
          "Fylke",
          "Kurs",
          "Kurstimer",
          "Deltakere",
          "Kurs pr. 1 000 innbyggere",
        ]}
      >
        {counties.map(
          (
            { name, courses, participants, hours, coursesPerCapita, isCurrent },
            i,
          ) => (
            <TableRow key={name} highlight={isCurrent} index={i} title={name}>
              <span key="courses">{intl.formatNumber(courses)}</span>
              <span key="hours">
                {intl.formatNumber(hours, {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span key="participants">{intl.formatNumber(participants)}</span>
              <span key="perCapita">
                {intl.formatNumber(coursesPerCapita * 1000, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </TableRow>
          ),
        )}
      </Table>
    </ReportPage>
    <ReportPage color="bg-amber-100">
      <Graph
        year={Number(year)}
        unit={name}
        type="Timer"
        values={historical.hours}
        totalUnit={totalUnit}
        totalValues={historicalAll && historicalAll.hours}
      />
      <Graph
        year={Number(year)}
        unit={name}
        type="Kurs"
        values={historical.courses}
        totalUnit={totalUnit}
        totalValues={historicalAll && historicalAll.courses}
      />
      <Graph
        year={Number(year)}
        unit={name}
        type="Deltakere"
        values={historical.participants}
        totalUnit={totalUnit}
        totalValues={historicalAll && historicalAll.participants}
      />
    </ReportPage>
  </>
);

export default Counties;
