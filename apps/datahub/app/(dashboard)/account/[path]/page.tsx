import { AccountView } from "@neondatabase/neon-js/auth/react/ui";
import { accountViewPaths } from "@neondatabase/neon-js/auth/react/ui/server";

import { TypographyH1 } from "@/components/ui/typography";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <>
      <TypographyH1>Brukerinnstillinger</TypographyH1>
      <AccountView path={path} />
    </>
  );
}
