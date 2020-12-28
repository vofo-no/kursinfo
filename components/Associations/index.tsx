import names from "../../data/names/associations.json";
import GraphOrgs from "../GraphOrgs";
import { Dictionary, IAssociation } from "../../types";
import { showName } from "../../utils/names";

interface PropTypes {
  items: Dictionary<IAssociation>;
  name: string;
  year: string;
}

function Associations({ items, year, name }: PropTypes) {
  const associationKeys = Object.keys(items)
    .sort((a, b) => items[b].hours - items[a].hours)
    .filter((key) => items[key].courses);
  return (
    <section className="page">
      <div className="container">
        <h2 className="h1">Studieforbund i {name}</h2>
        <h3 className="table-label">Kursoversikt for alle studieforbund</h3>
        <p className="subtitle">
          Antall kurs, timer og deltakere per studieforbund i {name} {year}
        </p>
        <div className="responsive-table">
          <table className="report-table">
            <thead>
              <tr>
                <td></td>
                <th className="left">Studieforbund</th>
                <th>Kurs</th>
                <th>Kurstimer</th>
                <th>Deltakere</th>
              </tr>
            </thead>
            <tbody>
              {associationKeys.map((key, i) => {
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
          keys={associationKeys}
          items={items}
          names={names}
          year={year}
          unit="Studieforbund"
        />
      </div>
    </section>
  );
}

export default Associations;
