import { initialize as initializeGraphs } from "components/Graph";
import Layout from "components/Layout";
import { useEffect } from "react";
import { AssociationReportProps } from "types/reports";

import Counties from "./Counties";
import Footer from "./Footer";
import Municipalities from "./Municipalities";
import Organizations from "./Organizations";
import Participants from "./Participants";
import ReportHeading from "./ReportHeading";
import ReportPage from "./ReportPage";
import Subjects from "./Subjects";
import Summary from "./Summary";

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
}: AssociationReportProps) => {
  useEffect(() => {
    initializeGraphs();
  }, []);

  return (
    <Layout title={`${name}: Studieforbundstatistikk ${year}`}>
      <ReportPage>
        <ReportHeading name={name} year={year} type="ASSOCIATION" />
        <Summary {...summary} />
        <div className="prose mx-auto">
          <p>
            Statistikken viser kursvirksomhet i studieforbund som er godkjent og
            får tilskudd etter{" "}
            <a href="https://lovdata.no/dokument/NL/lov/2009-06-19-95">
              voksenopplæringsloven
            </a>
            . Denne rapporten viser kurs som er gjennomført i{" "}
            <span className="whitespace-nowrap">{name}</span> i {year}.
          </p>
          <p>
            For mer informasjon, se <a href="http://www.vofo.no">vofo.no</a>{" "}
            eller kontakt Vofo på <a href="mailto:vofo@vofo.no">vofo@vofo.no</a>
            .
          </p>
          <Footer />
        </div>
      </ReportPage>
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
