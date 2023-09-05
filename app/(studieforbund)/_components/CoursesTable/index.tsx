import { Suspense } from "react";

import CoursesTableSkeleton from "./CoursesTableSkeleton";
import CoursesTableWrapper from "./CoursesTableWrapper";

interface Props {
  year: string;
  county: string;
  group: string;
  organization: string;
  tenant: string;
}

export default function CoursesTable(props: Props) {
  return (
    <Suspense fallback={<CoursesTableSkeleton />}>
      <CoursesTableWrapper {...props} />
    </Suspense>
  );
}
