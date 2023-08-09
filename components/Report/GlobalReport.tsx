import { GlobalReportProps } from "types/reports";

import Associations from "./Associations";
import Counties from "./Counties";
import FrontPage from "./FrontPage";
import Municipalities from "./Municipalities";
import Participants from "./Participants";
import Subjects from "./Subjects";

const GlobalReport = ({
  year,
  name,
  associations,
  counties,
  historical,
  mainSubjects,
  topSubjects,
  ageSetHistory,
  municipalities,
  summary,
  participantsHistogram,
  participantsHistogramSums,
  type,
}: GlobalReportProps) => {
  return (
    <>
      <FrontPage name={name} year={year} type={type} summary={summary} />
      <Counties
        counties={counties}
        year={year}
        name={name.toLowerCase()}
        historical={historical}
      />
      <Associations
        items={associations}
        year={year}
        name={name.toLowerCase()}
      />
      <Subjects
        mainSubjects={mainSubjects}
        topSubjects={topSubjects}
        ageSetHistory={ageSetHistory}
        year={year}
        name={name.toLowerCase()}
      />
      <Participants
        year={year}
        participantsHistogram={participantsHistogram}
        participantsHistogramSums={participantsHistogramSums}
        courses={summary.courses}
      />
      <Municipalities
        items={municipalities}
        year={year}
        name={name.toLowerCase()}
      />
    </>
  );
};

export default GlobalReport;
