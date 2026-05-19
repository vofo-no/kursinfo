import { notFound } from "next/navigation";

import { getTableData } from "@/app/(studieforbund)/_utils/getTableData";
import sumTableData from "@/app/(studieforbund)/_utils/sumTableData";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

import ClientTableWithPagination from "./ClientTableWithPagination";
import CoursesTableEmpty from "./CoursesTableEmpty";

interface Props {
  params: StudieforbundParams;
  tenant: string;
}

export async function CoursesTable({ params, tenant }: Props) {
  const data = await getTableData(
    tenant,
    params.year,
    params.county,
    params.organization,
  );

  if (!data) notFound();

  if (!data.items.length) return <CoursesTableEmpty />;

  const sums = sumTableData(data.items);

  return (
    <ClientTableWithPagination {...data} group={params.group} sums={sums} />
  );
}
