import { PageHeader, PageHeaderLead } from "@/components/page-header";

import { Datafiles } from "./datafiles";

export default function TeachersSynchronizationPage() {
  return (
    <div>
      <PageHeader>Synkronisering</PageHeader>
      <PageHeaderLead>
        Her finner du en oversikt over alle datafilene vi bruker for å lage
        kurslærerregisteret.
      </PageHeaderLead>
      <div className="mt-6 min-h-20">
        <Datafiles />
      </div>
    </div>
  );
}
