import Graph from "./Graph";
import names from "./names.json";

type SubjectType = {
  participants: {
    males: number;
    females: number;
  };
};

type SubjectsProps = {
  subjects: {
    [key: string]: SubjectType;
  };
  year: string;
  name: string;
  ages: [number];
};

function p(subject: SubjectType) {
  return subject.participants.females + subject.participants.males;
}

function Subjects({ subjects, ages, year, name }: SubjectsProps) {
  const subjectKeys = Object.keys(subjects)
    .sort((a, b) => p(subjects[b]) - p(subjects[a]))
    .filter((key) => p(subjects[key]));
  return (
    <section className="page blue">
      <div className="container">
        <h2>Deltakere på kursemner</h2>
        <h3 className="table-label">Deltakere innenfor ulike kursemner</h3>
        <p className="subtitle">
          Antall deltakere i {name} {year}, etter hovedemne og kjønn
        </p>
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
              } = subjects[key];
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
        <Graph year={year} ages={ages} />
      </div>
    </section>
  );
}

export default Subjects;
