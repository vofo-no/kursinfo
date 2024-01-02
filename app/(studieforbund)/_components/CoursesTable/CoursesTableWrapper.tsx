import { getTableData } from "app/(studieforbund)/_utils/getTableData";
import sumTableData from "app/(studieforbund)/_utils/sumTableData";
import { StudieforbundParams } from "app/(studieforbund)/types";
import { notFound } from "next/navigation";

import ClientTable from "./ClientTable";
import CoursesTableEmpty from "./CoursesTableEmpty";

interface Props {
  params: StudieforbundParams;
  tenant: string;
}

export default async function CoursesTableWrapper({ params, tenant }: Props) {
  const data = await getTableData(
    tenant,
    params.year,
    params.county,
    params.organization,
  );

  if (!data) notFound();

  if (!data.items.length) return <CoursesTableEmpty />;

  const sums = sumTableData(data.items);

  return <ClientTable {...data} group={params.group} sums={sums} />;
}
