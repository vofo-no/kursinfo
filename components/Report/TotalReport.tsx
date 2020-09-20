import { useEffect } from "react";

import { Logo } from "vofo-design";
import styled from "@emotion/styled";

import Layout from "../../components/Layout";
import ReportHeading from "../../components/ReportHeading";
import Summary from "../../components/Summary";
import Counties from "../../components/Counties";
import Associations from "../../components/Associations";
import Subjects from "../../components/Subjects";
import Municipalities from "../../components/Municipalities";
import ScrollDown from "../../components/ScrollDown";
import { initialize as initializeGraphs } from "../../components/Graph";

import { TotalReportProps } from "../../types";

const PageFooter = styled.div`
  text-align: center;
  margin: auto 0 0 0;
  padding: 1rem 0 0;
`;

export default function TotalReport({
  year,
  report,
  municipalities,
  counties,
}: TotalReportProps) {
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
              report.municipalities.filter(
                (m: string) => municipalities[m].courses
              ).length
            }
            allMunicipalitiesLength={Object.keys(municipalities).length}
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
          <PageFooter>
            <Logo />
            <ScrollDown />
          </PageFooter>
        </div>
      </section>
      <Counties
        counties={counties}
        year={year}
        name={report.name}
        historical={report.historical}
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
          municipalities={municipalities}
          municipalityKeys={report.municipalities}
          year={year}
          name={report.name}
        />
      )}
    </Layout>
  );
}