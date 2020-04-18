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
        <h2>Kurs i hele landet</h2>
        <p>
          Antall kurs, timer og deltakere pr. fylke etter kurs pr. 1 000
          innbyggere i {year}
        </p>
        <table>
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

export default Counties;
