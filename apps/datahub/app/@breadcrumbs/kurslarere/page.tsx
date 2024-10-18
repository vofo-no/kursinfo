import { Metadata } from "next";

import RouteBreadcrumbs from "@/components/route-breadcrumbs";

export const metadata: Metadata = {
  title: "Kurslærere",
};

export default function RBCDefault() {
  return (
    <RouteBreadcrumbs
      items={[
        { url: "/kurslarere", label: "Kurslærere" },
        { label: "Oversikt" },
      ]}
    />
  );
}
