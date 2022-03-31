import { initialize as initializeGraphs } from "components/Graph";
import Layout from "components/Layout";
import { useEffect } from "react";
import { GLOBAL, GlobalReportProps } from "types/reports";

import Associations from "./Associations";
import Counties from "./Counties";
import Footer from "./Footer";
import Municipalities from "./Municipalities";
import ReportHeading from "./ReportHeading";
import ReportPage from "./ReportPage";
import Subjects from "./Subjects";
import Summary from "./Summary";

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
}: GlobalReportProps) => {
  useEffect(() => {
    initializeGraphs();
  }, []);
  return (
    <Layout title={`${name}: Kursstatistikk ${year}`}>
      <ReportPage>
        <ReportHeading name={name} year={year} type={GLOBAL} />
        <Summary {...summary} />
        <div className="prose mx-auto">
          <p>
            Statistikken viser kursvirksomhet i studieforbund som er godkjent og
            får tilskudd etter{" "}
            <a href="https://lovdata.no/dokument/NL/lov/2009-06-19-95">
              voksenopplæringsloven
            </a>
            . Denne rapporten viser kurs som er gjennomført i {year}.
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
      <Municipalities
        items={municipalities}
        year={year}
        name={name.toLowerCase()}
      />
    </Layout>
  );
};

export default GlobalReport;
