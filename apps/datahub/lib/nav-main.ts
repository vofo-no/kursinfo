import { UsersIcon } from "lucide-react";

export function getNavMain(scope: string) {
  return [
    {
      title: "Kurslærere",
      url: `/${scope}/kurslarere`,
      icon: UsersIcon,
      items: [
        {
          title: "Oversikt",
          url: `/${scope}/kurslarere`,
        },
        {
          title: "Synkronisering",
          url: `/${scope}/kurslarere/synkronisering`,
        },
      ],
    },
  ];
}
