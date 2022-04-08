import { Tab } from "@headlessui/react";
import { Dispatch, PropsWithChildren } from "react";

import { GroupType } from "./constants";

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

interface GroupTabsProps {
  tabIndex: number;
  setTabIndex: Dispatch<number>;
}

const GroupTabs = ({
  tabIndex,
  setTabIndex,
  children,
}: PropsWithChildren<GroupTabsProps>) => {
  return (
    <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
      <Tab.List className="text-center border-b border-gray-200 flex flex-wrap items-start gap-2 mb-4">
        {tabs.map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              selected
                ? "inline-block p-2 -mb-px font-bold text-brand-blue rounded-t-lg border-b-2 border-brand-blue active"
                : "inline-block p-2 -mb-px rounded-t-lg border-b-2 border-transparent hover:text-primary-darker hover:border-gray-300 print:hidden"
            }
          >
            {tabLabels[tab]}
          </Tab>
        ))}
      </Tab.List>
      {children}
    </Tab.Group>
  );
};

export default GroupTabs;
