type MunicipalityType = {
  name: string;
  courses: number;
  participants: {
    males: number;
    females: number;
  };
  hours: number;
  coursesPerCapita: number;
};

type MunicipalitiesProps = {
  municipalities: {
    [key: string]: MunicipalityType;
  };
  municipalityKeys: [string];
  year: string;
  name: string;
};

function Municipalities({
  municipalities,
  year,
  name,
  municipalityKeys,
}: MunicipalitiesProps) {
  const municipalityKeysSorted = municipalityKeys.sort(
    (a, b) =>
      municipalities[b].coursesPerCapita - municipalities[a].coursesPerCapita
  );
  return (
    <section className="page yellow">
      <div className="container">
        <h2>Kommuner i {name}</h2>
        <h3 className="table-label">Kursoversikt for alle kommuner</h3>
        <p className="subtitle">
          Antall kurs, timer og deltakere per kommune etter kurs pr. 1 000
          innbyggere i {name} {year}
        </p>
        <div className="responsive-table">
          <table className="report-table">
            <thead>
              <tr>
                <td></td>
                <th className="left">Kommune</th>
                <th>Kurs</th>
                <th>Kurstimer</th>
                <th>Deltakere</th>
                <th>Kurs pr. 1 000 innbyggere</th>
              </tr>
            </thead>
            <tbody>
              {municipalityKeysSorted.map((key, i) => {
                const {
                  name,
                  courses,
                  participants,
                  hours,
                  coursesPerCapita,
                } = municipalities[key];
                return (
                  <tr key={key}>
                    <td>{i + 1}</td>
                    <th scope="row">{name}</th>
                    <td>{courses.toLocaleString("nb")}</td>
                    <td>{hours.toLocaleString("nb")}</td>
                    <td>
                      {(
                        participants.males + participants.females
                      ).toLocaleString("nb")}
                    </td>
                    <td>
                      {(coursesPerCapita * 1000).toLocaleString("nb", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Municipalities;
