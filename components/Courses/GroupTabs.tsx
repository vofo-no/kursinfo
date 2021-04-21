import "react-tabs/style/react-tabs.css";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "lib/constants";
import { FC } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
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
  <Tabs
    selectedIndex={tabs.indexOf(group) || 0}
    onSelect={(i) =>
      nav({
        group: tabs[i],
        ...unsetSpecific(tabs[i], { organization, county }),
      })
    }
  >
    <TabList>
      {tabs.map((tab) => (
        <Tab key={tab}>{tabLabels[tab]}</Tab>
      ))}
    </TabList>
    {tabs.map((tab) => (
      <TabPanel key={tab} />
    ))}
    {children}
  </Tabs>
);

export default GroupTabs;
