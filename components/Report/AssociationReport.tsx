import { initialize as initializeGraphs } from "components/Graph";
import Layout from "components/Layout";
import { useEffect } from "react";
import { AssociationReportProps } from "types/reports";

import Counties from "./Counties";
import FrontPage from "./FrontPage";
import Municipalities from "./Municipalities";
import Organizations from "./Organizations";
import Participants from "./Participants";
import Subjects from "./Subjects";

const AssociationReport = ({
  year,
  name,
  organizations,
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
}: AssociationReportProps) => {
  useEffect(() => {
    initializeGraphs();
  }, []);

  return (
    <Layout title={`${name}: Studieforbundstatistikk ${year}`}>
      <FrontPage name={name} year={year} type={type} summary={summary} />
      <Counties
        counties={counties}
        year={year}
        name={name}
        historical={historical}
        historicalAll={historicalAll}
        totalUnit="alle studieforbund"
      />
      <Organizations items={organizations} year={year} name={name} />
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
    </Layout>
  );
};

export default AssociationReport;
