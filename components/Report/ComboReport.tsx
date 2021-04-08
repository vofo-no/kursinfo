import Associations from "components/Associations";
import Counties from "components/Counties";
import { initialize as initializeGraphs } from "components/Graph";
import Layout from "components/Layout";
import Municipalities from "components/Municipalities";
import ReportHeading from "components/ReportHeading";
import Subjects from "components/Subjects";
import Summary from "components/Summary";
import { FC, useEffect } from "react";
import { COMBO, ComboReportProps } from "types/reports";

import Footer from "./Footer";

const ComboReport: FC<ComboReportProps> = ({
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
}) => {
  useEffect(() => {
    initializeGraphs();
  }, []);
  return (
    <Layout title={`${name}: Kursstatistikk ${year}`}>
      <section className="page">
        <div className="container">
          <ReportHeading name={name} year={year} type={COMBO} />
          <Summary {...summary} />
          <p>
            Statistikken viser tilskuddsberettiget kursvirksomhet i regi av
            godkjente studieforbund. Virksomheten måles i antall arrangerte
            kurs, antall deltakere og antall kurstimer. Denne rapporten viser
            kurs som er gjennomført i {name} i {year}.
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
      <Municipalities items={municipalities} year={year} name={name} />
    </Layout>
  );
};

export default ComboReport;
