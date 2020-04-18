import fs from "fs";
import path from "path";

import Layout from "../../components/Layout";
import Summary from "../../components/Summary";
import { years } from "../../data/index.json";
import Counties from "../../components/Counties";
import Associations from "../../components/Associations";
import VofoLogo from "../../components/VofoLogo";
import Subjects from "../../components/Subjects";

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
          <h1>
            {report.name}
            <small>Fylkesstatistikk {year}</small>
          </h1>
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
          <div className="page-footer">
            <VofoLogo />
          </div>
        </div>
      </section>
      <Counties counties={counties} year={year} />
      <Associations
        associations={report.associations}
        year={year}
        name={report.name}
      />
      <Subjects subjects={report.subjects} year={year} name={report.name} />
      <style jsx>{`
        .page-footer {
          margin-top: auto;
        }
      `}</style>
    </Layout>
  );
}
