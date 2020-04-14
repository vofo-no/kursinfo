import fs from "fs";
import path from "path";

import Feather, {
  Users,
  Clock,
  Map,
  Share2,
  UserCheck,
  Layers,
} from "react-feather";

import Layout from "../../components/Layout";
import { years } from "../../data/index.json";

export async function getStaticProps({ params }) {
  const dataPath = path.join(process.cwd(), `data/${params.year}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return {
    props: {
      year: params.year,
      report: data.reports[params.report],
      municipalities: data.municipalities,
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

type CardProps = {
  Icon: Feather.Icon;
  children: JSX.Element | string;
  label: string;
};

function Card({ Icon, children, label }: CardProps) {
  return (
    <div className="card">
      <Icon size={48} />
      <big>{children}</big>
      {label}
      <style jsx>{`
        .card {
          padding: 8px 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          flex-basis: 30%;
          margin-bottom: 18px;
        }

        .card big {
          font-weight: bold;
          font-size: 200%;
        }
      `}</style>
    </div>
  );
}

export default function Report({ year, report, municipalities }) {
  return (
    <Layout title={`${report.name}: Fylkesstatistikk ${year}`}>
      <h1>
        {report.name}
        <small>Fylkesstatistikk {year}</small>
      </h1>
      <div className="cards">
        <Card Icon={Layers} label="kurs">
          {report.courses.toLocaleString("nb")}
        </Card>
        <Card Icon={UserCheck} label="tilrettelagte kurs">
          {(report.facilitated.courses / report.courses).toLocaleString("nb", {
            style: "percent",
            minimumFractionDigits: 0,
          })}
        </Card>
        <Card Icon={Users} label="deltakere">
          {(
            report.participants.males + report.participants.females
          ).toLocaleString("nb")}
        </Card>
        <Card Icon={Clock} label="kurstimer">
          {report.hours.toLocaleString("nb")}
        </Card>
        <Card Icon={Share2} label="frivillige og ideelle organisasjoner">
          {report.organizations.toLocaleString("nb")}
        </Card>
        <Card Icon={Map} label="kommuner med kursvirksomhet">
          <>
            {
              report.municipalities.filter(
                (m: string) => municipalities[m].courses
              ).length
            }
            <small> av {report.municipalities.length}</small>
          </>
        </Card>
      </div>
      <style jsx>{`
        h1 {
          font-size: 300%;
          margin-bottom: 5rem;
        }
        h1 small {
          color: #777;
          display: block;
          font-size: 28px;
        }

        .cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
          width: 100%;
        }
      `}</style>
    </Layout>
  );
}
