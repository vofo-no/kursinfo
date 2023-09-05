import Container from "components/Containers/Container";
import WhiteBox from "components/Containers/WhiteBox";
import PageHeading from "components/PageHeading";
import { Suspense } from "react";

import injectDefaultParams from "../_helpers/injectDefaultParams";
import { makeTitle } from "../_helpers/makeTitle";
import { StudieforbundParams } from "../types";
import BuildTime from "./BuildTime";
import CoursesTableWrapper from "./CoursesTable";
import Filter from "./Filter";
import NavigationTabs from "./NavigationTabs";

export function StudieforbundGenerateMetadata({
  tenantName,
}: {
  tenantName: string;
}) {
  return async function generateMetadata({
    params,
  }: {
    params: Partial<StudieforbundParams>;
  }) {
    const { year, county } = injectDefaultParams(params);
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
    params: Partial<StudieforbundParams>;
  }) {
    const { year, county, group, organization } = injectDefaultParams(params);
    const title = makeTitle(year, county);

    return (
      <Container noPadding>
        <WhiteBox noPadding>
          <div className="overflow-x-auto print:overflow-x-visible relative">
            <Container>
              <PageHeading>{title}</PageHeading>
              <Filter
                year={year}
                county={county}
                organization={organization}
                tenant={tenant}
              />
              <NavigationTabs />
              <div className="relative">
                <CoursesTableWrapper
                  year={year}
                  county={county}
                  group={group}
                  organization={organization}
                  tenant={tenant}
                />
              </div>
            </Container>
          </div>
        </WhiteBox>
        <div className="text-right ml-auto mt-2 mr-2 text-xs">
          <Suspense
            fallback={
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            }
          >
            <BuildTime tenant={tenant} year={year} />
          </Suspense>
        </div>
      </Container>
    );
  };
}
