import { Clock, Layers, Map, Share2, UserCheck, Users } from "react-feather";

import { SummaryProps } from "@/types/reports";
import { formatNumber, formatPercent } from "@/lib/intl";

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
        {formatNumber(courses)}
      </Card>
      <Card Icon={UserCheck} label="tilrettelagte kurs">
        {formatPercent(facilitatedCourses / courses)}
      </Card>
      <Card Icon={Users} label="deltakere">
        {formatNumber(participants)}
      </Card>
      <Card Icon={Clock} label="kurstimer">
        {formatNumber(hours, 0)}
      </Card>
      <Card Icon={Share2} label="frivillige og ideelle organisasjoner">
        {formatNumber(organizations)}
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
