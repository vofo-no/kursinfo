"use client";

import { useCallback, useEffect, useReducer } from "react";
import { CourseSyncData } from "@kursinfo/db";
import { RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import {
  fetchCoursesAction,
  getSyncDataAction,
  syncDataToDbAction,
} from "./sync-row-actions";
import { SyncRowDataItem } from "./types";

const EAPPLY_BATCH_SIZE = 10;

interface ExistingMonthData {
  month: string;
  teacherCount: number;
  syncedAt: Date | null;
}

interface SyncRowState {
  dataItems: SyncRowDataItem[];
  dataItemsToProcess: SyncRowDataItem[];
  pendingTask?: string;
  error?: string;
  syncData: CourseSyncData[];
  existingMonthData?: ExistingMonthData;
}

interface FoundCoursesAction {
  type: "FOUND_COURSES";
  payload: {
    dataItems: SyncRowDataItem[];
  };
}

interface FindTeachersAction {
  type: "FIND_TEACHERS";
}

interface FoundTeachersAction {
  type: "FOUND_TEACHERS";
  payload: {
    syncData: CourseSyncData[];
  };
}

interface SyncErrorAction {
  type: "SYNC_ERROR";
  payload: {
    error: string;
  };
}

interface SyncStartAction {
  type: "SYNC_START";
}

interface SyncToDbAction {
  type: "SYNC_TO_DB";
}

interface SyncCompleteAction {
  type: "SYNC_COMPLETE";
  payload: {
    existingMonthData: ExistingMonthData;
  };
}

type SyncRowAction =
  | FoundCoursesAction
  | FindTeachersAction
  | FoundTeachersAction
  | SyncErrorAction
  | SyncStartAction
  | SyncToDbAction
  | SyncCompleteAction;

function syncRowReducer(
  state: SyncRowState,
  action: SyncRowAction,
): SyncRowState {
  switch (action.type) {
    case "FOUND_COURSES":
      return {
        ...state,
        dataItems: action.payload.dataItems,
      };
    case "FIND_TEACHERS":
      return {
        ...state,
        pendingTask: `Henter lærere... (${state.dataItems.length} kurs gjenstår)`,
        dataItemsToProcess: state.dataItems.slice(0, EAPPLY_BATCH_SIZE),
        dataItems: state.dataItems.slice(EAPPLY_BATCH_SIZE),
      };
    case "FOUND_TEACHERS":
      return {
        ...state,
        dataItemsToProcess: [],
        syncData: [...state.syncData, ...action.payload.syncData],
      };
    case "SYNC_ERROR":
      return {
        ...state,
        error: action.payload.error,
        syncData: [],
        dataItems: [],
        dataItemsToProcess: [],

        pendingTask: undefined,
      };
    case "SYNC_START":
      return {
        ...state,
        pendingTask: "Henter kurs...",
        error: undefined,
        syncData: [],
        dataItems: [],
        dataItemsToProcess: [],
      };
    case "SYNC_TO_DB":
      return {
        ...state,
        pendingTask: "Synkroniserer til database...",
      };
    case "SYNC_COMPLETE":
      return {
        pendingTask: undefined,
        error: undefined,
        syncData: [],
        dataItems: [],
        dataItemsToProcess: [],
        existingMonthData: action.payload.existingMonthData,
      };
    default:
      return state;
  }
}

function StatusCell({
  pendingTask,
  error,
  existingMonthData,
}: {
  pendingTask?: string;
  error?: string;
  existingMonthData?: ExistingMonthData;
}) {
  if (pendingTask) {
    return <span className="text-sm">{pendingTask}</span>;
  }
  if (error) {
    return <span className="text-sm text-destructive">{error}</span>;
  }
  if (existingMonthData) {
    return existingMonthData.syncedAt?.toLocaleDateString("no-NB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }
  return "Ikke synkronisert";
}

export function SyncRow({
  settings,
  month,
  existingMonthData,
}: {
  settings: { dbScope: string; dataScope: string };
  month: Date;
  existingMonthData:
    | {
        month: string;
        teacherCount: number;
        syncedAt: Date | null;
      }
    | undefined;
}) {
  const [state, dispatch] = useReducer(syncRowReducer, {
    dataItems: [],
    syncData: [],
    dataItemsToProcess: [],
    existingMonthData,
  });
  const updateData = useCallback(async () => {
    try {
      dispatch({ type: "SYNC_START" });
      await fetchCoursesAction(
        settings.dataScope,
        month.toISOString().substring(0, 7),
      ).then((dataItems) => {
        dispatch({ type: "FOUND_COURSES", payload: { dataItems } });
      });
    } catch (error) {
      dispatch({
        type: "SYNC_ERROR",
        payload: { error: "Feil ved henting av kurs" },
      });
      console.error("Error fetching courses:", error);
      return;
    }
  }, [settings, month]);

  // Check for dataitems to process
  useEffect(() => {
    if (state.dataItems.length > 0 && state.dataItemsToProcess.length === 0) {
      dispatch({ type: "FIND_TEACHERS" });
    }
  }, [state.dataItems, state.dataItemsToProcess]);

  // Process data items to find teachers
  useEffect(() => {
    if (state.dataItemsToProcess.length > 0) {
      // Fetch teachers for the current batch of data items
      getSyncDataAction(settings, state.dataItemsToProcess).then((syncData) => {
        dispatch({ type: "FOUND_TEACHERS", payload: { syncData } });
      });
    }
  }, [state.dataItemsToProcess, settings]);

  // When all data items have been processed, sync to DB
  useEffect(() => {
    if (
      state.dataItems.length === 0 &&
      state.dataItemsToProcess.length === 0 &&
      state.syncData.length > 0
    ) {
      dispatch({ type: "SYNC_TO_DB" });
      syncDataToDbAction(
        settings,
        month.toISOString().substring(0, 7),
        state.syncData,
      )
        .then((existingMonthData) => {
          dispatch({ type: "SYNC_COMPLETE", payload: { existingMonthData } });
        })
        .catch((error) => {
          dispatch({
            type: "SYNC_ERROR",
            payload: { error: "Feil ved synkronisering til database" },
          });
          console.error("Error syncing to DB:", error);
        });
    }
  }, [
    state.dataItems,
    state.dataItemsToProcess,
    state.syncData,
    settings,
    month,
  ]);

  return (
    <TableRow>
      <TableCell>
        {month.toLocaleDateString("no-NB", {
          year: "numeric",
          month: "long",
        })}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {state.existingMonthData?.teacherCount.toLocaleString("no-NB") || 0}
      </TableCell>
      <TableCell className="text-right">
        <StatusCell
          pendingTask={state.pendingTask}
          error={state.error}
          existingMonthData={state.existingMonthData}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          disabled={state.pendingTask !== undefined}
          title="Oppdater data"
          size="icon"
          onClick={() => updateData()}
        >
          <RefreshCcwIcon className={state.pendingTask ? "animate-spin" : ""} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
