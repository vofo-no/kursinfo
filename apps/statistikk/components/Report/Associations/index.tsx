import { Organization } from "@/types/reports";
import { formatNumber } from "@/lib/intl";
import { showName } from "@/components/names";

import GraphOrgs from "../GraphOrgs";
import ReportPage from "../ReportPage";
import Table, { TableRow } from "../Table";

interface PropTypes {
  items: Array<Organization>;
  name: string;
  year: string;
}

const Associations = ({ items, year, name }: PropTypes) => {
  return (
    <ReportPage title={`Studieforbund i ${name}`}>
      <Table
        title="Kursoversikt for alle studieforbund"
        subtitle={`Antall kurs, timer og deltakere per studieforbund i ${name} ${year}`}
        columns={["Studieforbund", "Kurs", "Kurstimer", "Deltakere"]}
      >
        {items.map(({ courses, participants, hours, key, ...rest }, i) => {
          return (
            <TableRow key={key} index={i} title={showName(rest)}>
              <span key="courses">{formatNumber(courses)}</span>
              <span key="hours">{formatNumber(hours, 0)}</span>
              <span key="participants">
                {formatNumber(participants.males + participants.females)}
              </span>
            </TableRow>
          );
        })}
      </Table>
      <GraphOrgs items={items} year={year} unit="Studieforbund" />
    </ReportPage>
  );
};

export default Associations;
