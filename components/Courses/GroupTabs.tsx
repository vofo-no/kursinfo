import { Dispatch, FC } from "react";
import { GroupType, isDefaultCounty, isDefaultOrganization } from "./constants";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

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

const isSpecific = (tab: GroupType, { organization, county }) => {
  if (tab === "fylker" && !isDefaultCounty(county)) return true;
  if (tab === "organisasjoner" && !isDefaultOrganization(organization))
    return true;
  return false;
};

interface GroupTabsProps {
  group: GroupType;
  setGroup: Dispatch<GroupType>;
  organization: string;
  county: string;
  children: JSX.Element;
}

const GroupTabs: FC<GroupTabsProps> = ({
  group,
  setGroup,
  organization,
  county,
  children,
}) => (
  <Tabs
    selectedIndex={tabs.indexOf(group) || 0}
    onSelect={(i) => setGroup(tabs[i])}
  >
    <TabList>
      {tabs.map((tab) => (
        <Tab key={tab} disabled={isSpecific(tab, { organization, county })}>
          {tabLabels[tab]}
        </Tab>
      ))}
    </TabList>
    {tabs.map((tab) => (
      <TabPanel key={tab} />
    ))}
    {children}
  </Tabs>
);

export default GroupTabs;
