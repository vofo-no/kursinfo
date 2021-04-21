import { Box } from "@vofo-no/design";
import { FC } from "react";
import { Clock, Layers, Map, Share2, UserCheck, Users } from "react-feather";
import { FormattedNumber } from "react-intl";
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
        <FormattedNumber value={courses} />
      </Card>
      <Card Icon={UserCheck} label="tilrettelagte kurs">
        <FormattedNumber
          style="percent"
          minimumFractionDigits={0}
          value={facilitatedCourses / courses}
        />
      </Card>
      <Card Icon={Users} label="deltakere">
        <FormattedNumber value={participants} />
      </Card>
      <Card Icon={Clock} label="kurstimer">
        <FormattedNumber value={hours} />
      </Card>
      <Card Icon={Share2} label="frivillige og ideelle organisasjoner">
        <FormattedNumber value={organizations} />
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
