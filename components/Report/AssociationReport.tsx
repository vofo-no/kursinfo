import { useEffect } from "react";

import Layout from "../../components/Layout";
import ReportHeading from "../../components/ReportHeading";
import Summary from "../../components/Summary";
import Counties from "../../components/Counties";
import Subjects from "../../components/Subjects";
import Municipalities from "../../components/Municipalities";
import { initialize as initializeGraphs } from "../../components/Graph";
import Footer from "./Footer";

import { AssociationReportProps } from "../../types";
import Organizations from "../Organizations";

export default function AssociationReport({
  year,
  report,
  municipalityNames,
  counties,
  orgNames = {},
}: AssociationReportProps) {
  useEffect(() => {
    initializeGraphs();
  }, []);
  return (
    <Layout title={`${report.name}: Studieforbundstatistikk ${year}`}>
      <section className="page">
        <div className="container">
          <ReportHeading name={report.name} year={year} type="ASSOCIATION" />
          <Summary
            courses={report.courses}
            facilitatedCourses={report.facilitated.courses}
            participants={report.participants}
            hours={report.hours}
            organizations={report.organizations}
            activeMunicipalitiesLength={
              Object.keys(report.municipalityValues).length
            }
            allMunicipalitiesLength={Object.keys(municipalityNames).length}
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
        totalUnit="alle studieforbund"
      />
      <Organizations
        items={report.associations}
        names={orgNames}
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
      <Municipalities
        items={report.municipalityValues}
        names={municipalityNames}
        year={year}
        name={report.name}
      />
    </Layout>
  );
}
