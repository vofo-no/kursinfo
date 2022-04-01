import { Tab } from "@headlessui/react";
import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "lib/constants";
import { FC } from "react";
import { CoursesParams } from "types/courses";

import { GroupType, isDefaultCounty, isDefaultOrganization } from "./constants";

const tabs: GroupType[] = [
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

const unsetSpecific = (
  tab: GroupType,
  { organization, county }: { organization: string; county: string }
) => {
  if (tab === "fylker" && !isDefaultCounty(county))
    return { county: DEFAULT_COUNTY_PARAM };
  if (tab === "organisasjoner" && !isDefaultOrganization(organization))
    return { organization: DEFAULT_ORGANIZATION_PARAM };
  return {};
};

interface GroupTabsProps {
  group: GroupType;
  nav: (query: Partial<CoursesParams>) => void;
  organization: string;
  county: string;
  children: JSX.Element;
}

const GroupTabs: FC<GroupTabsProps> = ({
  group,
  organization,
  county,
  nav,
  children,
}) => (
  <Tab.Group
    selectedIndex={tabs.indexOf(group) || 0}
    onChange={(i) =>
      nav({
        group: tabs[i],
        ...unsetSpecific(tabs[i], { organization, county }),
      })
    }
  >
    <Tab.List className="text-center border-b border-gray-200 flex flex-wrap items-start gap-2 mb-4">
      {tabs.map((tab) => (
        <Tab
          key={tab}
          className={({ selected }) =>
            selected
              ? "inline-block p-2 font-bold text-brand-blue rounded-t-lg border-b-2 border-brand-blue active"
              : "inline-block p-2 rounded-t-lg border-b-2 border-transparent hover:text-primary-darker hover:border-gray-300 print:hidden"
          }
        >
          {tabLabels[tab]}
        </Tab>
      ))}
    </Tab.List>
    {children}
  </Tab.Group>
);

export default GroupTabs;
