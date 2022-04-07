import { initialize as initializeGraphs } from "components/Graph";
import Layout from "components/Layout";
import { useEffect } from "react";
import { RegionReportProps } from "types/reports";

import Associations from "./Associations";
import Counties from "./Counties";
import FrontPage from "./FrontPage";
import Municipalities from "./Municipalities";
import Participants from "./Participants";
import Subjects from "./Subjects";

const RegionReport = ({
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
}: RegionReportProps) => {
  useEffect(() => {
    initializeGraphs();
  }, []);

  return (
    <Layout title={`${name}: Fylkesstatistikk ${year}`}>
      <FrontPage name={name} year={year} type={type} summary={summary} />
      <Counties
        counties={counties}
        year={year}
        name={name}
        historical={historical}
        historicalAll={historicalAll}
        totalUnit="hele landet"
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
      {municipalities.length > 2 && (
        <Municipalities
          items={municipalities}
          year={year}
          name={name}
          initialLimit={municipalities.length}
        />
      )}
    </Layout>
  );
};

export default RegionReport;
