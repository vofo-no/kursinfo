import { FC, Fragment } from "react";
import { AgeSet, MainSubjectWithKey } from "types/reports";

import Graph from "./Graph";
import names from "./names.json";

type NameKey = keyof typeof names;

interface SubjectsProps {
  mainSubjects: Array<MainSubjectWithKey>;
  topSubjects: AgeSet<Array<{ key: string; value: number }>>;
  ageSetHistory: Array<AgeSet<number>>;
  name: string;
  year: string;
}

export const ageGroupName = [
  "14-19 år",
  "20-29 år",
  "30-39 år",
  "40-49 år",
  "50-59 år",
  "60+ år",
];

const Subjects: FC<SubjectsProps> = ({
  mainSubjects,
  topSubjects,
  ageSetHistory,
  year,
  name,
}) => {
  return (
    <>
      <section className="page blue">
        <div className="container">
          <h2 className="h1">Deltakere på kursemner</h2>
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
                {mainSubjects.map(
                  ({ key, participants: { males, females } }, i) => {
                    return (
                      <tr key={key}>
                        <td>{i + 1}</td>
                        <th scope="row">
                          {key in names ? names[key as NameKey] : key}
                        </th>
                        <td>{females.toLocaleString("nb")}</td>
                        <td>{males.toLocaleString("nb")}</td>
                        <td>{(females + males).toLocaleString("nb")}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
          <Graph year={Number(year)} ages={ageSetHistory} />
        </div>
      </section>
      <section className="page">
        <div className="container">
          {topSubjects.map((subjectItems, ageIndex) => (
            <Fragment key={`ag-tab-${ageIndex}`}>
              <h3 className="table-label">
                Topp 5 kursemner for deltakere {ageGroupName[ageIndex]}
              </h3>
              <p className="subtitle">
                Kursemner etter antall deltakere i aldersgruppen{" "}
                {ageGroupName[ageIndex]}
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
                    {subjectItems.map(({ key, value }, i) => {
                      return (
                        <tr key={key}>
                          <td>{i + 1}</td>
                          <th scope="row">
                            {key in names ? names[key as NameKey] : key}
                          </th>
                          <td>{value.toLocaleString("nb")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
};

export default Subjects;
