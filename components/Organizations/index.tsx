import GraphOrgs from "../GraphOrgs";
import { COLORS } from "../Layout";
import { Dictionary, IAssociation, INamed } from "../../types";
import { showName } from "../../utils/names";

interface PropTypes {
  items: Dictionary<IAssociation>;
  names: Dictionary<INamed>;
  name: string;
  year: string;
}

function Organizations({ items, year, name, names }: PropTypes) {
  const allKeys = Object.keys(items).filter((key) => items[key].courses);
  const limit = allKeys.length > 6 ? 5 : undefined;

  const organizationKeys = allKeys
    .sort((a, b) => items[b].hours - items[a].hours)
    .slice(0, limit);

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
              {organizationKeys.map((key, i) => {
                const { courses, participants, hours } = items[key];
                return (
                  <tr key={key}>
                    <td>{i + 1}</td>
                    <th scope="row">{showName(names[key] || key)}</th>
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
          keys={organizationKeys}
          items={items}
          names={names}
          year={year}
          unit="Organisasjon"
        />
      </div>
      <style jsx>
        {`
          th small {
            font-weight: normal;
            color: ${COLORS.grayDark};
          }
        `}
      </style>
    </section>
  );
}

export default Organizations;
