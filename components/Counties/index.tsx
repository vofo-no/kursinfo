import Graph from "./Graph";

type Historical = {
  courses: [number];
  participants: [number];
  hours: [number];
};

type CountiesProps = {
  counties: {
    name: string;
    courses: number;
    participants: number;
    hours: number;
    coursesPerCapita: number;
    isCurrent: boolean;
  }[];
  historical: Historical;
  historicalAll: Historical;
  year: string;
  name: string;
};

function Counties({
  counties,
  year,
  name,
  historical,
  historicalAll,
}: CountiesProps) {
  return (
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
            county={name}
            type="Timer"
            values={historical.hours}
            nationalValues={historicalAll.hours}
          />
          <Graph
            year={Number(year)}
            county={name}
            type="Kurs"
            values={historical.courses}
            nationalValues={historicalAll.courses}
          />
          <Graph
            year={Number(year)}
            county={name}
            type="Deltakere"
            values={historical.participants}
            nationalValues={historicalAll.participants}
          />
        </div>
      </section>
    </>
  );
}

export default Counties;
