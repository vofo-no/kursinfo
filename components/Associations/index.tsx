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
};

function Associations({ associations, year }: AssociationsProps) {
  const associationKeys = Object.keys(associations)
    .sort((a, b) => associations[b].hours - associations[a].hours)
    .filter((key) => associations[key].courses);
  return (
    <section className="page blue">
      <div className="container">
        <h2>Studieforbund i fylket</h2>
        <p>
          Antall kurs, timer og deltakere pr. studieforbund etter kurstimer i{" "}
          {year}
        </p>
        <table>
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
        <style jsx>{`
          th,
          td {
            padding: 6px 12px;
          }
          table {
            border-collapse: collapse;
          }
          thead th {
            font-size: smaller;
            font-weight: normal;
            text-align: right;
          }
          thead th.left {
            text-align: left;
          }
          tbody th,
          tbody td {
            border-top: 1px solid #ccc;
          }
          tbody th {
            text-align: left;
          }
          tbody th small {
            font-weight: normal;
          }
          tbody td {
            text-align: right;
            font-variant-numeric: tabular-nums;
          }

          tr.current {
            background-color: #ffd700;
            border: 2px solid #000;
          }

          tr.current td,
          tr.current th {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
          }
        `}</style>
      </div>
    </section>
  );
}

export default Associations;
