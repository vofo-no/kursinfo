import { Column } from "@tanstack/react-table";

import { IndexedCourseItem } from "@/types/courses";

export function Arrow({
  column: { getIsSorted, getCanSort },
}: {
  column: Column<IndexedCourseItem>;
}) {
  if (!getCanSort()) return null;

  const isSorted = getIsSorted();
  if (!isSorted)
    return (
      <svg viewBox="0 0 10 14" width="12" height="14">
        <polyline points="1 6, 6 1, 11 6" />
        <polyline points="1 8, 6 13, 11 8" />
      </svg>
    );

  return (
    <svg viewBox="0 0 10 14" width="12" height="14">
      {isSorted === "desc" ? (
        <polyline points="1 4, 6 13, 11 4" />
      ) : (
        <polyline points="1 12, 6 3, 11 12" />
      )}
    </svg>
  );
}
