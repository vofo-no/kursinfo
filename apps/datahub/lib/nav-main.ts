import { useParams } from "next/navigation";
import { UsersIcon } from "lucide-react";

export function useNavMain() {
  const { scope } = useParams();
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
