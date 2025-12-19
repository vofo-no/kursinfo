import { OrganizationView } from "@neondatabase/neon-js/auth/react/ui";
import { organizationViewPaths } from "@neondatabase/neon-js/auth/react/ui/server";

import { TypographyH1 } from "@/components/ui/typography";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(organizationViewPaths).map((path) => ({ path }));
}

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <>
      <TypographyH1>Administrer organisasjon</TypographyH1>
      <OrganizationView path={path} />
    </>
  );
}
