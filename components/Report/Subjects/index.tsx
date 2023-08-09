import intl from "lib/intl";
import { Fragment } from "react";
import { AgeSet, MainSubjectWithKey } from "types/reports";

import ReportPage from "../ReportPage";
import Table, { TableRow } from "../Table";
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

const Subjects = ({
  mainSubjects,
  topSubjects,
  ageSetHistory,
  year,
  name,
}: SubjectsProps) => {
  return (
    <>
      <ReportPage color="bg-blue-50" title="Deltakere på kursemner">
        <Table
          title="Deltakere innenfor ulike kursemner"
          subtitle={`Antall deltakere i ${name} ${year}, etter hovedemne og kjønn`}
          columns={["Emne", "Kvinner", "Menn", "Sum deltakere"]}
        >
          {mainSubjects.map(({ key, participants: { males, females } }, i) => {
            return (
              <TableRow
                key={key}
                index={i}
                title={key in names ? names[key as NameKey] : key}
              >
                <span key="females">{intl.formatNumber(females)}</span>
                <span key="males">{intl.formatNumber(males)}</span>
                <span key="sum">{intl.formatNumber(females + males)}</span>
              </TableRow>
            );
          })}
        </Table>
        <Graph year={Number(year)} ages={ageSetHistory} />
      </ReportPage>
      <ReportPage>
        {topSubjects.map((subjectItems, ageIndex) => (
          <Fragment key={`ag-tab-${ageIndex}`}>
            <Table
              title={`Topp 5 kursemner for deltakere ${ageGroupName[ageIndex]}`}
              subtitle={`Kursemner etter antall deltakere i aldersgruppen ${ageGroupName[ageIndex]}`}
              columns={["Emne", "Deltakere"]}
            >
              {subjectItems.map(({ key, value }, i) => {
                return (
                  <TableRow
                    key={key}
                    index={i}
                    title={key in names ? names[key as NameKey] : key}
                  >
                    {[<span key="value">{intl.formatNumber(value)}</span>]}
                  </TableRow>
                );
              })}
            </Table>
          </Fragment>
        ))}
      </ReportPage>
    </>
  );
};

export default Subjects;
