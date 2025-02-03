import { getServerListTeacherDatafiles } from "@/lib/firebase/firebase.server";
import { PageHeader, PageHeaderLead } from "@/components/page-header";

import { Datafiles } from "./datafiles";

function getDataList(scope: string) {
  return getServerListTeacherDatafiles(scope);
}

export default async function TeachersSynchronizationPage({
  params,
}: {
  params: Promise<{ scope: string }>;
}) {
  const scope = (await params).scope;
  const dataList = await getDataList(scope);

  return (
    <div>
      <PageHeader>Synkronisering</PageHeader>
      <PageHeaderLead>
        Her finner du en oversikt over alle datafilene vi bruker for å lage
        kurslærerregisteret.
      </PageHeaderLead>
      <div className="mt-6 min-h-20">
        <Datafiles dataList={dataList} />
      </div>
    </div>
  );
}
