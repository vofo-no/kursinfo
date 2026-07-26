import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExpandedState,
  GroupingState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

interface HookProps {
  defaultSorting: SortingState;
  defaultGrouping: GroupingState;
  defaultVisibility: VisibilityState;
}

interface TableStateValues {
  page: number;
  sort: SortingState;
  grouping: GroupingState;
  expanded: ExpandedState;
  visibility: VisibilityState;
}

type TableStateUpdater =
  | Partial<TableStateValues>
  | ((prev: TableStateValues) => Partial<TableStateValues>);

export function useTableState({
  defaultSorting,
  defaultGrouping,
  defaultVisibility,
}: HookProps) {
  const [state, setState] = useState<TableStateValues>({
    page: 1,
    sort: defaultSorting,
    grouping: defaultGrouping,
    expanded: {},
    visibility: defaultVisibility,
  });

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setTableState = useCallback((updater: TableStateUpdater) => {
    if (!isMounted.current) return;
    setState((prev) => ({
      ...prev,
      ...(typeof updater === "function" ? updater(prev) : updater),
    }));
  }, []);

  return [state, setTableState] as const;
}
