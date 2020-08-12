type CountiesProps = {
  counties: {
    name: string;
    courses: number;
    participants: number;
    hours: number;
    coursesPerCapita: number;
    isCurrent: boolean;
  }[];
  year: string;
};

function Counties({ counties, year }: CountiesProps) {
  return (
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
                    <td>{i + 1}</td>
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

export default Counties;
