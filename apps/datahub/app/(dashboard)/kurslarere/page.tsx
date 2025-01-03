import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { PageHeader, PageHeaderLead } from "@/components/page-header";
import { Teacher } from "@/app/types";

import { TeachersTable } from "./teachers-table";

async function getData(): Promise<Teacher[]> {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  const scope = currentUser?.customClaims.scope;
  if (currentUser && scope) {
    const s = getStorage(firebaseServerApp);

    const pathReference = ref(s, `${scope}/2024.json`);

    try {
      const url = await getDownloadURL(pathReference);
      return (await fetch(url)).json();
    } catch {
      return [];
    }
  }
  return [];
}

export default async function TeachersPage() {
  const teachersData = await getData();

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
