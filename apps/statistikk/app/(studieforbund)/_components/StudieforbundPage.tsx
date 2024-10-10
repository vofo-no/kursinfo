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
    params: StudieforbundParams;
  }) {
    const { year, county } = params;
    {
      const title = makeTitle(year, county);

      return {
        title: `${title} - ${tenantName}`,
      };
    }
  };
}

export function StudieforbundPage({ tenant }: { tenant: string }) {
  return async function Page({ params }: { params: StudieforbundParams }) {
    return <CoursesTableWrapper params={params} tenant={tenant} />;
  };
}
