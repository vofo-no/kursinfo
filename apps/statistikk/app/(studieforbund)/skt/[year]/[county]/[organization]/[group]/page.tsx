import { CoursesTable } from "@/app/(studieforbund)/_components/CoursesTable";
import { makeTitle } from "@/app/(studieforbund)/_helpers/makeTitle";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

import { config } from "../../../../config";

interface Props {
  params: Promise<StudieforbundParams>;
}

export async function generateMetadata({ params }: Props) {
  const { year, county } = await params;
  const title = makeTitle(year, county);

  return {
    title: `${title} - ${config.tenantName}`,
  };
}

export default function StudieforbundPage() {
  return <CoursesTable tenant={config.tenant} />;
}
