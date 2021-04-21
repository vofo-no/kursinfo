import { FC, useState } from "react";
import { FormattedNumber } from "react-intl";
import { ReportMunicipality } from "types/reports";

interface PropTypes {
  items: Array<ReportMunicipality>;
  year: string;
  name: string;
  initialLimit?: number;
}

const Municipalities: FC<PropTypes> = ({
  year,
  name,
  items,
  initialLimit = 25,
}) => {
  const [limit, setLimit] = useState(initialLimit);
  return (
    <section className="page yellow">
      <div className="container">
        <h2 className="h1">Kommuner i {name}</h2>
        <h3 className="table-label">
          Kursoversikt for{" "}
          {limit < items.length ? `topp ${limit} av ${items.length}` : "alle"}{" "}
          kommuner
        </h3>
        <p className="subtitle">
          Antall kurs, timer og deltakere per kommune etter kurs pr. 1 000
          innbyggere i {name} {year}
        </p>
        <div className="responsive-table">
          <table className="report-table">
            <thead>
              <tr>
                <td></td>
                <th className="left">Kommune</th>
                <th>Kurs</th>
                <th>Kurstimer</th>
                <th>Deltakere</th>
                <th>Kurs pr. 1 000 innbyggere</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, limit).map(({ name, values }, i) => {
                const [
                  courses = 0,
                  hours = 0,
                  participants = 0,
                  coursesPerCapita = 0,
                ] = values;
                return (
                  <tr key={name}>
                    <td>{i + 1}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
        {limit < items.length && (
          <p className="no-print">
            <button onClick={() => setLimit(limit + 25)}>Vis flere</button>{" "}
            <button onClick={() => setLimit(items.length)}>Vis alle</button>
          </p>
        )}
      </div>
    </section>
  );
};

export default Municipalities;
