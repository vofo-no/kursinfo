import { useEffect } from "react";

import Layout from "../../components/Layout";
import ReportHeading from "../../components/ReportHeading";
import Summary from "../../components/Summary";
import Counties from "../../components/Counties";
import Associations from "../../components/Associations";
import Subjects from "../../components/Subjects";
import Municipalities from "../../components/Municipalities";
import { initialize as initializeGraphs } from "../../components/Graph";
import Footer from "./Footer";

import { RegionReportProps } from "../../types";

export default function RegionReport({
  year,
  report,
  municipalityNames,
  counties,
}: RegionReportProps) {
  useEffect(() => {
    initializeGraphs();
  }, []);
  return (
    <Layout title={`${report.name}: Fylkesstatistikk ${year}`}>
      <section className="page">
        <div className="container">
          <ReportHeading name={report.name} year={year} type="REGION" />
          <Summary
            courses={report.courses}
            facilitatedCourses={report.facilitated.courses}
            participants={report.participants}
            hours={report.hours}
            organizations={report.organizations}
            activeMunicipalitiesLength={
              Object.keys(report.municipalityValues).length
            }
            allMunicipalitiesLength={report.municipalities.length}
          />
          <p>
            Statistikken viser tilskuddsberettiget kursvirksomhet i regi av
            godkjente studieforbund. Virksomheten måles i antall arrangerte
            kurs, antall deltakere og antall kurstimer. Denne rapporten viser
            kurs som er gjennomført i {report.name} i {year}.
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
        name={report.name}
        historical={report.historical}
        historicalAll={report.historicalAll}
        totalUnit="hele landet"
      />
      <Associations
        items={report.associations}
        year={year}
        name={report.name}
      />
      <Subjects
        mainSubjects={report.mainSubjects}
        subjects={report.subjects}
        topSubjects={report.topSubjects}
        ages={report.participants.ages}
        year={year}
        name={report.name}
      />
      {report.municipalities.length > 2 && (
        <Municipalities
          items={report.municipalityValues}
          names={municipalityNames}
          keys={report.municipalities}
          year={year}
          name={report.name}
        />
      )}
    </Layout>
  );
}
