import { ComboReportProps } from "@/types/reports";

import Associations from "./Associations";
import Counties from "./Counties";
import FrontPage from "./FrontPage";
import Municipalities from "./Municipalities";
import Participants from "./Participants";
import Subjects from "./Subjects";

const ComboReport = ({
  year,
  name,
  associations,
  counties,
  historical,
  historicalAll,
  mainSubjects,
  topSubjects,
  ageSetHistory,
  municipalities,
  summary,
  participantsHistogram,
  participantsHistogramSums,
  type,
}: ComboReportProps) => {
  return (
    <>
      <FrontPage name={name} year={year} type={type} summary={summary} />
      <Counties
        counties={counties}
        year={year}
        name={name}
        historical={historical}
        historicalAll={historicalAll}
        totalUnit="alle studieforbund"
      />
      <Associations items={associations} year={year} name={name} />
      <Subjects
        mainSubjects={mainSubjects}
        topSubjects={topSubjects}
        ageSetHistory={ageSetHistory}
        year={year}
        name={name}
      />
      <Participants
        year={year}
        participantsHistogram={participantsHistogram}
        participantsHistogramSums={participantsHistogramSums}
        courses={summary.courses}
      />
      <Municipalities items={municipalities} year={year} name={name} />
    </>
  );
};

export default ComboReport;
