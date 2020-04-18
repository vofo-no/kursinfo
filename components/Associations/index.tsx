import names from "./names.json";
import Graph from "./Graph";

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
        <h2>Studieforbund i {name}</h2>
        <p>
          Antall kurs, timer og deltakere pr. studieforbund etter kurstimer i{" "}
          {name} {year}
        </p>
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
                    {names[key] || key} <small>({names.short[key]})</small>
                  </th>
                  <td>{courses.toLocaleString("nb")}</td>
                  <td>{hours.toLocaleString("nb")}</td>
                  <td>
                    {(participants.males + participants.females).toLocaleString(
                      "nb"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Graph
          associationKeys={associationKeys}
          associations={associations}
          year={year}
        />
      </div>
    </section>
  );
}

export default Associations;
