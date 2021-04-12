import { Box } from "@vofo-no/design";
import { FC } from "react";
import { Clock, Layers, Map, Share2, UserCheck, Users } from "react-feather";
import { SummaryProps } from "types/reports";

import Card from "./Card";

const Summary: FC<SummaryProps> = ({
  courses,
  facilitatedCourses,
  participants,
  hours,
  organizations,
  activeMunicipalitiesLength,
  allMunicipalitiesLength,
}) => (
  <>
    <Box
      display="grid"
      gridTemplateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)"]}
      gridColumnGap={3}
      gridRowGap={5}
      my={6}
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
        {participants.toLocaleString("nb")}
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
    </Box>
  </>
);

export default Summary;
