import { ReactNode, useEffect, useReducer } from "react";
import { useParams } from "next/navigation";
import { CourseStatuses } from "@kursinfo/julien/constants";
import {
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleXIcon,
  LoaderIcon,
} from "lucide-react";

import { mergeTeachers } from "@/lib/teachers";
import { arrUnique, cn } from "@/lib/utils";
import { collectTeachers } from "@/app/actions/collect-teachers";
import { fetchStatisticsData } from "@/app/actions/fetch-statistics-data";
import { fetchTeachers } from "@/app/actions/fetch-teachers";
import { uploadTeachers } from "@/app/actions/upload-teachers";
import { Teacher } from "@/app/types";

import { monthKeyToFormat } from "./helper";

interface DatafilesUpdateProps {
  tasks: string[];
}

interface DatafilesUpdateState {
  foundYears: string[];
  tasks: {
    taskId: string;
    total: number;
    pendingIds: string[];
    teachers: Teacher[];
    uploaded: boolean;
  }[];
  lockTask?: string;
  lockUpload?: string;
  lockYear?: string;
  collectedYears: string[];
  lockCollect?: string;
}

interface FindYearAction {
  type: "FIND_YEAR";
  payload: string;
}

interface AddTaskAction {
  type: "ADD_TASK";
  payload: {
    taskId: string;
    ids: string[];
  };
}

interface LockAction {
  type: "LOCK_TASK" | "LOCK_UPLOAD" | "LOCK_YEAR";
  payload: string;
}

interface UpdateTaskAction {
  type: "UPDATE_TASK";
  payload: {
    taskId: string;
    ids: string[];
    teachers: Teacher[];
  };
}
interface UploadedAction {
  type: "UPLOADED";
  payload: string;
}
interface CollectAction {
  type: "COLLECT_START";
  payload: string;
}
interface CollectDoneAction {
  type: "COLLECT_DONE";
  payload: string;
}

function updateReducer(
  state: DatafilesUpdateState,
  action:
    | FindYearAction
    | AddTaskAction
    | LockAction
    | UpdateTaskAction
    | UploadedAction
    | CollectAction
    | CollectDoneAction,
): DatafilesUpdateState {
  switch (action.type) {
    case "FIND_YEAR": {
      return {
        ...state,
        foundYears: arrUnique([...state.foundYears, action.payload]),
        lockYear: undefined,
      };
    }
    case "ADD_TASK": {
      return {
        ...state,
        tasks: [
          ...state.tasks.filter(
            (item) => item.taskId !== action.payload.taskId,
          ),
          {
            taskId: action.payload.taskId,
            total: action.payload.ids.length,
            pendingIds: action.payload.ids,
            teachers: [],
            uploaded: false,
          },
        ],
      };
    }
    case "LOCK_TASK": {
      return {
        ...state,
        lockTask: action.payload,
      };
    }
    case "LOCK_UPLOAD": {
      return {
        ...state,
        lockUpload: action.payload,
      };
    }
    case "LOCK_YEAR": {
      return {
        ...state,
        lockYear: action.payload,
      };
    }
    case "UPDATE_TASK": {
      return {
        ...state,
        tasks: state.tasks.map((item) => {
          if (item.taskId === action.payload.taskId) {
            return {
              ...item,
              pendingIds: item.pendingIds.filter(
                (item) => !action.payload.ids.includes(item),
              ),
              teachers: mergeTeachers(
                item.teachers.concat(action.payload.teachers),
              ),
            };
          } else {
            return item;
          }
        }),
        lockTask: undefined,
      };
    }
    case "UPLOADED": {
      return {
        ...state,
        tasks: state.tasks.map((item) =>
          item.taskId === action.payload
            ? {
                ...item,
                uploaded: true,
              }
            : item,
        ),
        lockUpload: undefined,
      };
    }
    case "COLLECT_START": {
      return {
        ...state,
        lockCollect: action.payload,
      };
    }
    case "COLLECT_DONE": {
      return {
        ...state,
        collectedYears: [...state.collectedYears, action.payload],
        lockCollect: undefined,
      };
    }
  }
  throw "Unknown action";
}

export function DatafilesUpdate({ tasks }: DatafilesUpdateProps) {
  const [state, dispatch] = useReducer(updateReducer, {
    foundYears: [],
    tasks: [],
    collectedYears: [],
  });
  const years = arrUnique(tasks.map((task) => task.split("-")[0]));
  const { scope } = useParams<{ scope: string }>();

  useEffect(() => {
    if (state.lockYear) return;

    const nextYear = years.find((year) => !state.foundYears.includes(year));

    if (nextYear) {
      dispatch({ type: "LOCK_YEAR", payload: nextYear });

      fetchStatisticsData(Number(nextYear)).then((data) => {
        dispatch({
          type: "FIND_YEAR",
          payload: nextYear,
        });
        tasks
          .filter((taskId) => taskId.startsWith(`${nextYear}-`))
          .forEach((taskId) => {
            const ids = data
              .filter(
                (item) =>
                  item.hasTeacher &&
                  item.status === CourseStatuses.DONE &&
                  item.endDate?.startsWith(`${taskId}-`),
              )
              .map((item) => item.ID);
            dispatch({
              type: "ADD_TASK",
              payload: {
                taskId,
                ids,
              },
            });
          });
      });
    }
  }, [state.foundYears, state.lockYear, tasks, years]);

  useEffect(() => {
    if (state.lockTask) return;

    const nextTask = state.tasks.find((task) => task.pendingIds.length);

    if (nextTask) {
      dispatch({ type: "LOCK_TASK", payload: nextTask.taskId });
      const ids = nextTask.pendingIds.slice(0, 10);
      fetchTeachers(ids).then((teachers) =>
        dispatch({
          type: "UPDATE_TASK",
          payload: {
            taskId: nextTask.taskId,
            ids,
            teachers,
          },
        }),
      );
    }
  }, [state.lockTask, state.tasks]);

  useEffect(() => {
    if (state.lockUpload) return;

    const nextUpload = state.tasks.find(
      (task) => task.pendingIds.length === 0 && !task.uploaded,
    );

    if (nextUpload) {
      dispatch({ type: "LOCK_UPLOAD", payload: nextUpload.taskId });
      uploadTeachers(scope, nextUpload.taskId, nextUpload.teachers).then(() => {
        dispatch({
          type: "UPLOADED",
          payload: nextUpload.taskId,
        });
      });
    }
  }, [scope, state.lockUpload, state.tasks]);

  useEffect(() => {
    if (state.lockCollect) return;

    const nextCollectYear = state.foundYears.find(
      (year) =>
        state.tasks.filter(
          (task) => task.taskId.startsWith(`${year}-`) && !task.uploaded,
        ).length === 0,
    );

    if (nextCollectYear) {
      dispatch({ type: "COLLECT_START", payload: nextCollectYear });
      collectTeachers(
        scope,
        nextCollectYear,
        state.tasks.filter((task) =>
          task.taskId.startsWith(`${nextCollectYear}-`),
        ),
      ).then(() => {
        dispatch({
          type: "COLLECT_DONE",
          payload: nextCollectYear,
        });
      });
    }
  }, [state.lockCollect, state.foundYears, state.tasks, scope]);

  return (
    <div className="space-y-3">
      {years.map((year) => (
        <TaskIndicator
          status={
            state.foundYears.includes(year)
              ? "done"
              : state.lockYear === year
                ? "pending"
                : "waiting"
          }
          key={`fetch.status.${year}`}
        >
          {state.foundYears.includes(year)
            ? `Hentet statistikk for hele ${year}`
            : `Henter statistikk for hele ${year}...`}
        </TaskIndicator>
      ))}
      {state.tasks.map((task) => {
        return [
          <TaskIndicator
            status={
              task.pendingIds.length == 0
                ? "done"
                : state.lockTask === task.taskId
                  ? "pending"
                  : "waiting"
            }
            key={`fetch.status.${task}`}
          >
            Hentet lærere fra{" "}
            {task.pendingIds.length
              ? `${task.total - task.pendingIds.length} av `
              : " "}
            {task.total} kurs i {monthKeyToFormat(task.taskId)}
          </TaskIndicator>,
          <TaskIndicator
            status={
              task.uploaded
                ? "done"
                : state.lockUpload === task.taskId
                  ? "pending"
                  : "waiting"
            }
            key={`upload.status.${task.taskId}`}
          >
            Lagre {task.teachers.length} lærere fra{" "}
            {monthKeyToFormat(task.taskId)}...
          </TaskIndicator>,
        ];
      })}
      {years.map((year) => (
        <TaskIndicator
          status={
            state.collectedYears.includes(year)
              ? "done"
              : state.lockCollect === year
                ? "pending"
                : "waiting"
          }
          key={`collect.status.${year}`}
        >
          {state.collectedYears.includes(year)
            ? `Laget data for hele ${year}`
            : `Lager data for hele ${year}...`}
        </TaskIndicator>
      ))}
    </div>
  );
}

interface TaskIndicatorProps {
  children: ReactNode;
  status: "waiting" | "pending" | "done" | "failed";
}

const TaskIcon = {
  waiting: CircleDashedIcon,
  pending: LoaderIcon,
  done: CircleCheckBigIcon,
  failed: CircleXIcon,
} as const;

function TaskIndicator({ status, children }: TaskIndicatorProps) {
  const Icon = TaskIcon[status];
  return (
    <div
      className={cn(
        "flex gap-2 items-center",
        {
          waiting: "text-muted-foreground",
          done: "text-green-800",
          failed: "text-destructive-foreground",
          pending: "font-semibold",
        }[status],
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4",
          status === "pending" &&
            "motion-safe:animate-[spin_2s_linear_infinite]",
        )}
      />
      <span className="text-sm">{children}</span>
    </div>
  );
}
