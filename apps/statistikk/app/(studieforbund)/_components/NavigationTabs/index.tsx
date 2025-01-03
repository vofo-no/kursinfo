"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { GroupType } from "@/app/(studieforbund)/_components/CoursesTable/constants";
import getHref from "@/app/(studieforbund)/_helpers/getHref";
import { unsetSpecific } from "@/app/(studieforbund)/_helpers/unsetSpecific";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

export const tabs: GroupType[] = [
  "organisasjoner",
  "fylker",
  "lag",
  "kurs",
  "studieplaner",
];

const tabLabels: Record<GroupType, string> = {
  kurs: "Kurs",
  fylker: "Fylker",
  organisasjoner: "Organisasjoner",
  lag: "Lokallag",
  studieplaner: "Studieplaner",
};

export default function NavigationTabs() {
  const params = useParams<StudieforbundParams>();
  const prefix = usePathname()?.split("/", 2)[1] || "";
  const organization = params.organization;
  const county = params.county;

  return (
    <nav>
      <div className="text-center border-b border-gray-200 flex flex-wrap items-start gap-2 mb-4">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={getHref(prefix, params, {
              group: tab,
              ...unsetSpecific(tab, { organization, county }),
            })}
            className={
              tab === params.group
                ? "inline-block p-2 -mb-px font-bold text-brand-blue rounded-t-lg border-b-2 border-brand-blue active"
                : "inline-block p-2 -mb-px rounded-t-lg border-b-2 border-transparent hover:text-primary-darker hover:border-gray-300 print:hidden"
            }
          >
            {tabLabels[tab]}
          </Link>
        ))}
      </div>
    </nav>
  );
}
