import { Column } from "@tanstack/react-table";
import { IndexedCourseItem } from "types/courses";

export function getHeaderSortingProps(
  column: Column<IndexedCourseItem>,
  isPlaceholder: boolean = false,
): {
  "aria-sort"?: "descending" | "ascending" | "none";
  tabIndex?: number;
  onClick?: (event: unknown) => void;
} {
  if (!column.getCanSort() || isPlaceholder) return {};

  const isSorted = column.getIsSorted();

  if (!isSorted)
    return {
      tabIndex: 0,
      "aria-sort": "none",
      onClick: column.getToggleSortingHandler(),
    };

  return {
    "aria-sort": isSorted === "desc" ? "descending" : "ascending",
    tabIndex: 0,
    onClick: column.getToggleSortingHandler(),
  };
}
