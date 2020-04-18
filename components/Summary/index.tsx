import { Users, Clock, Map, Share2, UserCheck, Layers } from "react-feather";
import Card from "./Card";

type SummaryTypes = {
  courses: number;
  facilitatedCourses: number;
  participants: {
    males: number;
    females: number;
  };
  hours: number;
  organizations: number;
  activeMunicipalitiesLength: number;
  allMunicipalitiesLength: number;
};

function Summary({
  courses,
  facilitatedCourses,
  participants,
  hours,
  organizations,
  activeMunicipalitiesLength,
  allMunicipalitiesLength,
}: SummaryTypes) {
  return (
    <>
      <div className="cards">
        <Card Icon={Layers} label="kurs">
          {courses.toLocaleString("nb")}
        </Card>
        <Card Icon={UserCheck} label="tilrettelagte kurs">
          {(facilitatedCourses / courses).toLocaleString("nb", {
            style: "percent",
            minimumFractionDigits: 0,
          })}
        </Card>
        <Card Icon={Users} label="deltakere">
          {(participants.males + participants.females).toLocaleString("nb")}
        </Card>
        <Card Icon={Clock} label="kurstimer">
          {hours.toLocaleString("nb")}
        </Card>
        <Card Icon={Share2} label="frivillige og ideelle organisasjoner">
          {organizations.toLocaleString("nb")}
        </Card>
        <Card Icon={Map} label="kommuner med kursvirksomhet">
          <>
            {activeMunicipalitiesLength}
            <small> av {allMunicipalitiesLength}</small>
          </>
        </Card>
      </div>
      <style jsx>{`
        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 1rem;
          row-gap: 2.5rem;
          margin: 3rem auto;
        }
      `}</style>
    </>
  );
}

export default Summary;
