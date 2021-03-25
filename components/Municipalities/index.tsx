import { FC, useState } from "react";

import { CompactValues } from "../../types";

interface PropTypes {
  names: Record<string, string>;
  items: Record<string, CompactValues>;
  keys?: string[];
  year: string;
  name: string;
}

function perCapita(item?: Array<number>) {
  return (item && item[3]) || 0;
}

const Municipalities: FC<PropTypes> = ({ names, year, name, items, keys }) => {
  const [limit, setLimit] = useState(keys ? keys.length : 25);
  const municipalityKeysSorted = (keys || Object.keys(items)).sort(
    (a, b) => perCapita(items[b]) - perCapita(items[a])
  );
  return (
    <section className="page yellow">
      <div className="container">
        <h2 className="h1">Kommuner i {name}</h2>
        <h3 className="table-label">
          Kursoversikt for{" "}
          {limit < municipalityKeysSorted.length
            ? `topp ${limit} av ${municipalityKeysSorted.length}`
            : "alle"}{" "}
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
              {municipalityKeysSorted.slice(0, limit).map((key, i) => {
                const [
                  courses = 0,
                  hours = 0,
                  participants = 0,
                  coursesPerCapita = 0,
                ] = items[key] || [];
                return (
                  <tr key={key}>
                    <td>{i + 1}</td>
                    <th scope="row">{names[key]}</th>
                    <td>{courses.toLocaleString("nb")}</td>
                    <td>{hours.toLocaleString("nb")}</td>
                    <td>{participants.toLocaleString("nb")}</td>
                    <td>
                      {(coursesPerCapita * 1000).toLocaleString("nb", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {limit < municipalityKeysSorted.length && (
          <p className="no-print">
            <button onClick={() => setLimit(limit + 25)}>Vis flere</button>{" "}
            <button onClick={() => setLimit(municipalityKeysSorted.length)}>
              Vis alle
            </button>
          </p>
        )}
      </div>
    </section>
  );
};

export default Municipalities;
