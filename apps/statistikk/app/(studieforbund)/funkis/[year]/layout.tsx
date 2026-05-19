import { getTenantYearsCached } from "@/lib/get-tenant-years-cached";
import StudieforbundLayout from "@/app/(studieforbund)/_components/StudieforbundLayout";

import { config } from "../config";

export async function generateStaticParams() {
  const years = await getTenantYearsCached(config.tenant);

  return years.map((year) => ({ year }));
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return (
    <StudieforbundLayout {...config} year={year}>
      {children}
    </StudieforbundLayout>
  );
}
