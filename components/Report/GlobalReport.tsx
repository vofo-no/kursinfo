import Associations from "components/Associations";
import Counties from "components/Counties";
import { initialize as initializeGraphs } from "components/Graph";
import Layout from "components/Layout";
import Municipalities from "components/Municipalities";
import ReportHeading from "components/ReportHeading";
import Subjects from "components/Subjects";
import Summary from "components/Summary";
import { FC, useEffect } from "react";
import { GLOBAL, GlobalReportProps } from "types/reports";

import Footer from "./Footer";

const GlobalReport: FC<GlobalReportProps> = ({
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
}) => {
  useEffect(() => {
    initializeGraphs();
  }, []);
  return (
    <Layout title={`${name}: Kursstatistikk ${year}`}>
      <section className="page">
        <div className="container">
          <ReportHeading name={name} year={year} type={GLOBAL} />
          <Summary {...summary} />
          <p>
            Statistikken viser tilskuddsberettiget kursvirksomhet i regi av
            godkjente studieforbund. Virksomheten måles i antall arrangerte
            kurs, antall deltakere og antall kurstimer. Denne rapporten viser
            kurs som er gjennomført i {year}.
          </p>
          <p>
            For mer informasjon, se <a href="http://www.vofo.no">vofo.no</a>{" "}
            eller kontakt Voksenopplæringsforbundet på{" "}
            <a href="mailto:vofo@vofo.no">vofo@vofo.no</a>.
          </p>
          <Footer />
        </div>
      </section>
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
