import GraphOrgs from "components/GraphOrgs";
import { FC } from "react";
import { Organization } from "types/reports";
import { showName } from "utils/names";

interface PropTypes {
  items: Array<Organization>;
  name: string;
  year: string;
}

const Associations: FC<PropTypes> = ({ items, year, name }) => {
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
              {items.map(
                ({ courses, participants, hours, key, ...rest }, i) => {
                  return (
                    <tr key={key}>
                      <td>{i + 1}</td>
                      <th scope="row">{showName(rest)}</th>
                      <td>{courses.toLocaleString("nb")}</td>
                      <td>{hours.toLocaleString("nb")}</td>
                      <td>
                        {(
                          participants.males + participants.females
                        ).toLocaleString("nb")}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
        <GraphOrgs items={items} year={year} unit="Studieforbund" />
      </div>
    </section>
  );
};

export default Associations;
