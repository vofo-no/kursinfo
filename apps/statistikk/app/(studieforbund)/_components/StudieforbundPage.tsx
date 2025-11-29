import { makeTitle } from "../_helpers/makeTitle";
import { StudieforbundParams } from "../types";
import CoursesTableWrapper from "./CoursesTable";

export function StudieforbundGenerateMetadata({
  tenantName,
}: {
  tenantName: string;
}) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<StudieforbundParams>;
  }) {
    const { year, county } = await params;
    {
      const title = makeTitle(year, county);

      return {
        title: `${title} - ${tenantName}`,
      };
    }
  };
}

export function StudieforbundPage({ tenant }: { tenant: string }) {
  return async function Page({
    params,
  }: {
    params: Promise<StudieforbundParams>;
  }) {
    return <CoursesTableWrapper params={await params} tenant={tenant} />;
  };
}
