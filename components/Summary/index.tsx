import { Users, Clock, Map, Share2, UserCheck, Layers } from "react-feather";
import Card from "./Card";
import { Container } from "vofo-design";

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
      <Container
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gridColumnGap={3}
        gridRowGap={4}
        my={4}
      >
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
      </Container>
    </>
  );
}

export default Summary;
