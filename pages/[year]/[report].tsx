import fs from "fs";
import path from "path";

import { Logo } from "vofo-design";
import styled from "@emotion/styled";

import Layout from "../../components/Layout";
import ReportHeading from "../../components/ReportHeading";
import Summary from "../../components/Summary";
import { years } from "../../data/index.json";
import Counties from "../../components/Counties";
import Associations from "../../components/Associations";
import Subjects from "../../components/Subjects";
import Municipalities from "../../components/Municipalities";
import ScrollDown from "../../components/ScrollDown";

const PageFooter = styled.div`
  text-align: center;
  margin: auto 0 0 0;
  padding: 1rem 0 0;
`;

export async function getStaticProps({ params }) {
  const dataPath = path.join(process.cwd(), `data/${params.year}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const report = data.reports[params.report];

  const counties = Object.keys(data.reports)
    .filter((key) => !data.reports[key].isFuture)
    .map((key) => {
      const {
        name,
        courses,
        participants,
        hours,
        municipalities,
      } = data.reports[key];
      const cPop = municipalities.reduce(
        (acc, ckey) => acc + data.municipalities[ckey].pop,
        0
      );
      return {
        name: name,
        courses: courses,
        participants: participants.males + participants.females,
        hours: hours,
        coursesPerCapita: courses / cPop,
        isCurrent: municipalities.every((m) =>
          report.municipalities.includes(m)
        ),
      };
    })
    .sort((a, b) => b.coursesPerCapita - a.coursesPerCapita);

  return {
    props: {
      year: params.year,
      report,
      municipalities: data.municipalities,
      counties,
    },
  };
}

export async function getStaticPaths() {
  let paths = [];
  years.map((year) => {
    const dataPath = path.join(process.cwd(), `data/${year}.json`);
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8")).reports;
    Object.keys(data).map((report) => {
      paths.push({ params: { year, report } });
    });
  });
  return { paths, fallback: false };
}

export default function Report({ year, report, municipalities, counties }) {
  return (
    <Layout title={`${report.name}: Fylkesstatistikk ${year}`}>
      <section className="page">
        <div className="container">
          <ReportHeading name={report.name} year={year} />
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
        historicalAll={report.historicalAll}
      />
      <Associations
        associations={report.associations}
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
