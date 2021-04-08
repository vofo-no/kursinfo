import { IReportBase, ReportPropsBase } from "types/reports";

function unpack(
  keys: Array<string>,
  ageSetIndex: number,
  subjects: IReportBase["subjects"]
) {
  return keys.map((key) => ({
    key,
    value: subjects[key].participants.ages[ageSetIndex],
  }));
}

export default function getTopSubjectsFromData(
  subjects: IReportBase["subjects"],
  topSubjects: IReportBase["topSubjects"]
): ReportPropsBase["topSubjects"] {
  return [
    unpack(topSubjects[0], 0, subjects),
    unpack(topSubjects[1], 1, subjects),
    unpack(topSubjects[2], 2, subjects),
    unpack(topSubjects[3], 3, subjects),
    unpack(topSubjects[4], 4, subjects),
    unpack(topSubjects[5], 5, subjects),
  ];
}
