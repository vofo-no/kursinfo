import { getTableData } from "app/(studieforbund)/_utils/getTableData";
import sumTableData from "app/(studieforbund)/_utils/sumTableData";
import { notFound } from "next/navigation";

import ClientTable from "./ClientTable";
import CoursesTableEmpty from "./CoursesTableEmpty";

interface Props {
  year: string;
  county: string;
  group: string;
  organization: string;
  tenant: string;
}

export default async function CoursesTableWrapper({
  year,
  county,
  organization,
  tenant,
  group,
}: Props) {
  const data = await getTableData(tenant, year, county, organization);

  if (!data) notFound();

  if (!data.items.length) return <CoursesTableEmpty />;

  const sums = sumTableData(data.items);

  return <ClientTable {...data} group={group} sums={sums} />;
}
