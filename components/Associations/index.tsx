import names from "./names.json";
import Graph from "./Graph";
import { COLORS } from "../Layout";

type AssociationsProps = {
  associations: {
    [key: string]: {
      courses: number;
      participants: {
        males: number;
        females: number;
      };
      hours: number;
    };
  };
  year: string;
  name: string;
};

function Associations({ associations, year, name }: AssociationsProps) {
  const associationKeys = Object.keys(associations)
    .sort((a, b) => associations[b].hours - associations[a].hours)
    .filter((key) => associations[key].courses);
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
                const { courses, participants, hours } = associations[key];
                return (
                  <tr key={key}>
                    <td>{i + 1}</td>
                    <th scope="row">
                      {names[key] || key}{" "}
                      {names.short[key] && <small>({names.short[key]})</small>}
                    </th>
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
        <Graph
          associationKeys={associationKeys}
          associations={associations}
          year={year}
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

export default Associations;
