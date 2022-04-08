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

const Organizations = ({ items, year, name }: PropTypes) => {
  const limit = items.length > 6 ? 5 : undefined;

  return (
    <ReportPage title="Organisasjoner i studieforbundet">
      <Table
        title={`Kursoversikt for ${
          limit ? `topp ${limit} ` : "alle "
        } organisasjoner`}
        subtitle={`Antall kurs, timer og deltakere per organisasjon i ${name} ${year}`}
        columns={["Organisasjon", "Kurs", "Kurstimer", "Deltakere"]}
      >
        {items
          .slice(0, limit)
          .map(({ courses, participants, hours, key, ...rest }, i) => {
            return (
              <TableRow key={key} index={i} title={showName(rest, key)}>
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
      <GraphOrgs
        items={items.slice(0, limit)}
        year={year}
        unit="Organisasjon"
      />
    </ReportPage>
  );
};

export default Organizations;
