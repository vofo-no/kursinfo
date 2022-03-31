import { Clock, Layers, Map, Share2, UserCheck, Users } from "react-feather";
import { FormattedNumber } from "react-intl";
import { SummaryProps } from "types/reports";

import Card from "./Card";

const Summary = ({
  courses,
  facilitatedCourses,
  participants,
  hours,
  organizations,
  activeMunicipalitiesLength,
  allMunicipalitiesLength,
}: SummaryProps) => (
  <>
    <div className="grid grid-cols-2 tablet:grid-cols-3 gap-6 gap-y-10 my-12">
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
    </div>
  </>
);

export default Summary;
