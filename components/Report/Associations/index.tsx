import { showName } from "components/names";
import { FormattedNumber } from "react-intl";
import { Organization } from "types/reports";

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
              <FormattedNumber key="courses" value={courses} />
              <FormattedNumber key="hours" value={hours} />
              <FormattedNumber
                key="participants"
                value={participants.males + participants.females}
              />
            </TableRow>
          );
        })}
      </Table>
      <GraphOrgs items={items} year={year} unit="Studieforbund" />
    </ReportPage>
  );
};

export default Associations;
