import { FC } from "react";
import { FormattedNumber } from "react-intl";

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

const Counties: FC<PropTypes> = ({
  counties,
  year,
  name,
  historical,
  historicalAll,
  totalUnit,
}) => (
  <>
    <section className="page yellow">
      <div className="container">
        <h2 className="h1">Kurs i hele landet</h2>
        <h3 className="table-label">Kursoversikt for alle fylker</h3>
        <p className="subtitle">
          Antall kurs, timer og deltakere per fylke etter kurs pr. 1 000
          innbyggere i {year}
        </p>
        <div className="responsive-table">
          <table className="report-table">
            <thead>
              <tr>
                <td></td>
                <th className="left">Fylke</th>
                <th>Kurs</th>
                <th>Kurstimer</th>
                <th>Deltakere</th>
                <th>Kurs pr. 1 000 innbyggere</th>
              </tr>
            </thead>
            <tbody>
              {counties.map(
                (
                  {
                    name,
                    courses,
                    participants,
                    hours,
                    coursesPerCapita,
                    isCurrent,
                  },
                  i
                ) => (
                  <tr key={name} className={isCurrent ? "current" : ""}>
                    <td>
                      <span className="bl">{i + 1}</span>
                    </td>
                    <th scope="row">{name}</th>
                    <td>
                      <FormattedNumber value={courses} />
                    </td>
                    <td>
                      <FormattedNumber value={hours} />
                    </td>
                    <td>
                      <FormattedNumber value={participants} />
                    </td>
                    <td>
                      <FormattedNumber
                        value={coursesPerCapita * 1000}
                        minimumFractionDigits={1}
                        maximumFractionDigits={1}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <style jsx>{`
          tr.current {
            background-color: #ffd700;
          }

          tr.current span.bl {
            border: 2px solid red;
            display: inline;
            box-sizing: border-box;
            margin: -4px;
            padding: 4px;
            border-radius: 50%;
          }
        `}</style>
      </div>
    </section>
    <section className="page yellow">
      <div className="container">
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
      </div>
    </section>
  </>
);

export default Counties;
