import { StudieforbundParams } from "app/(studieforbund)/types";
import { Suspense } from "react";

import CoursesTableSkeleton from "./CoursesTableSkeleton";
import CoursesTableWrapper from "./CoursesTableWrapper";

interface Props {
  params: StudieforbundParams;
  tenant: string;
}

export default function CoursesTable(props: Props) {
  return (
    <Suspense fallback={<CoursesTableSkeleton />}>
      <CoursesTableWrapper {...props} />
    </Suspense>
  );
}
