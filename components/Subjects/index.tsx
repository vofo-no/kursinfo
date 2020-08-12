import Graph from "./Graph";
import names from "./names.json";

type SubjectType = {
  participants: {
    males: number;
    females: number;
    ages?: [number];
  };
};

type SubjectsProps = {
  mainSubjects: {
    [key: string]: SubjectType;
  };
  subjects: {
    [key: string]: SubjectType;
  };
  topSubjects: [[string]];
  year: string;
  name: string;
  ages: [number];
};

function p(subject: SubjectType) {
  return subject.participants.females + subject.participants.males;
}

const ageGroupName = [
  "14-19 år",
  "20-29 år",
  "30-39 år",
  "40-49 år",
  "50-59 år",
  "60+ år",
];

function Subjects({
  mainSubjects,
  subjects,
  topSubjects,
  ages,
  year,
  name,
}: SubjectsProps) {
  const subjectKeys = Object.keys(mainSubjects)
    .sort((a, b) => p(mainSubjects[b]) - p(mainSubjects[a]))
    .filter((key) => p(mainSubjects[key]));
  return (
    <>
      <section className="page blue">
        <div className="container">
          <h2>Deltakere på kursemner</h2>
          <h3 className="table-label">Deltakere innenfor ulike kursemner</h3>
          <p className="subtitle">
            Antall deltakere i {name} {year}, etter hovedemne og kjønn
          </p>
          <div className="responsive-table">
            <table className="report-table">
              <thead>
                <tr>
                  <td></td>
                  <th className="left">Emne</th>
                  <th>Kvinner</th>
                  <th>Menn</th>
                  <th>Sum deltakere</th>
                </tr>
              </thead>
              <tbody>
                {subjectKeys.map((key, i) => {
                  const {
                    participants: { males, females },
                  } = mainSubjects[key];
                  return (
                    <tr key={key}>
                      <td>{i + 1}</td>
                      <th scope="row">{names[key] || key}</th>
                      <td>{females.toLocaleString("nb")}</td>
                      <td>{males.toLocaleString("nb")}</td>
                      <td>{(females + males).toLocaleString("nb")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Graph year={year} ages={ages} />
        </div>
      </section>
      <section className="page">
        <div className="container">
          {[0, 1, 2, 3, 4, 5].map((age) => (
            <>
              <h3 className="table-label">
                Topp 5 kursemner for deltakere {ageGroupName[age]}
              </h3>
              <p className="subtitle">
                Kursemner etter antall deltakere i aldersgruppen{" "}
                {ageGroupName[age]}
              </p>
              <div className="responsive-table">
                <table className="report-table">
                  <thead>
                    <tr>
                      <td></td>
                      <th className="left">Emne</th>
                      <th>Deltakere</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSubjects[age].map((key, i) => {
                      const {
                        participants: { ages: topSubjectAges },
                      } = subjects[key];
                      return (
                        <tr key={key}>
                          <td>{i + 1}</td>
                          <th scope="row">{names[key] || key}</th>
                          <td>{topSubjectAges[age].toLocaleString("nb")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ))}
        </div>
      </section>
    </>
  );
}

export default Subjects;
