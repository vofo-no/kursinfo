import { Clock, Layers, Map, Share2, UserCheck, Users } from "react-feather";

import { SummaryProps } from "@/types/reports";
import intl from "@/lib/intl";

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
        {intl.formatNumber(courses)}
      </Card>
      <Card Icon={UserCheck} label="tilrettelagte kurs">
        {intl.formatNumber(facilitatedCourses / courses, {
          style: "percent",
          minimumFractionDigits: 0,
        })}
      </Card>
      <Card Icon={Users} label="deltakere">
        {intl.formatNumber(participants)}
      </Card>
      <Card Icon={Clock} label="kurstimer">
        {intl.formatNumber(hours, {
          maximumFractionDigits: 0,
        })}
      </Card>
      <Card Icon={Share2} label="frivillige og ideelle organisasjoner">
        {intl.formatNumber(organizations)}
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
