import { getTenantYears } from "@kursinfo/julien";

import StudieforbundLayout from "@/app/(studieforbund)/_components/StudieforbundLayout";

import { config } from "../config";

export function generateStaticParams() {
  return getTenantYears(config.tenant).map((year) => ({ year }));
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
