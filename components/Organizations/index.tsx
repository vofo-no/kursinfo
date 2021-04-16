import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/nb";

import GraphOrgs from "components/GraphOrgs";
import { FC } from "react";
import { Organization } from "types/reports";
import { showName } from "utils/names";

interface PropTypes {
  items: Array<Organization>;
  name: string;
  year: string;
}

const Organizations: FC<PropTypes> = ({ items, year, name }) => {
  const limit = items.length > 6 ? 5 : undefined;

  return (
    <section className="page">
      <div className="container">
        <h2 className="h1">Organisasjoner i studieforbundet</h2>
        <h3 className="table-label">
          Kursoversikt for {limit ? `topp ${limit} ` : "alle "}
          organisasjoner
        </h3>
        <p className="subtitle">
          Antall kurs, timer og deltakere per organisasjon i {name} {year}
        </p>
        <div className="responsive-table">
          <table className="report-table">
            <thead>
              <tr>
                <td></td>
                <th className="left">Organisasjon</th>
                <th>Kurs</th>
                <th>Kurstimer</th>
                <th>Deltakere</th>
              </tr>
            </thead>
            <tbody>
              {items
                .slice(0, limit)
                .map(({ courses, participants, hours, key, ...rest }, i) => {
                  return (
                    <tr key={key}>
                      <td>{i + 1}</td>
                      <th scope="row">{showName(rest, key)}</th>
                      <td>{courses.toLocaleString("nb")}</td>
                      <td>{hours.toLocaleString("nb")}</td>
                      <td>
                        {(
                          participants.males + participants.females
                        ).toLocaleString("nb")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <GraphOrgs
          items={items.slice(0, limit)}
          year={year}
          unit="Organisasjon"
        />
      </div>
    </section>
  );
};

export default Organizations;
