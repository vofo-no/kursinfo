import { getServerDownloadUrl } from "@/lib/firebase/firebase.server";
import { PageHeader, PageHeaderLead } from "@/components/page-header";
import { Teacher } from "@/app/types";

import { TeachersTable } from "./teachers-table";

async function getData(scope: string): Promise<Teacher[]> {
  try {
    const url = await getServerDownloadUrl(`${scope}/2024.json`);
    return (await fetch(url)).json();
  } catch {
    return [];
  }
}

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ scope: string }>;
}) {
  const scope = (await params).scope;
  const teachersData = await getData(scope);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2">
          <PageHeader>Kurslærere</PageHeader>
          <PageHeaderLead>
            Register over alle kurslærere i studieforbundet.
          </PageHeaderLead>
        </div>
        <TeachersTable data={teachersData} />
      </div>
    </>
  );
}
