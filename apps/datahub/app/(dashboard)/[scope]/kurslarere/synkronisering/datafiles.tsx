"use client";

import { useMemo, useState } from "react";

import { formatDate } from "@/lib/intl";

import { DatafilesForm } from "./datafiles-form";
import { DatafilesUpdate } from "./datafiles-update";
import { getDates, getMonthKey, monthFormat } from "./helper";

interface DatafileMeta {
  name: string;
  timeCreated: string;
  size: number;
  teachers?: string;
}

export function Datafiles({ dataList }: { dataList: DatafileMeta[] }) {
  const [tasks, setTasks] = useState<string[]>([]);
  const datesIndex = useMemo(() => getDates(), []);

  if (tasks.length) {
    return <DatafilesUpdate tasks={tasks} />;
  }

  return (
    <div className="overflow-auto">
      <DatafilesForm
        submitHandler={setTasks}
        items={datesIndex.map((d) => {
          const key = getMonthKey(d);
          const file = dataList.find((file) => file.name.startsWith(key));
          return {
            id: key,
            label: monthFormat.format(d),
            description: file
              ? `${formatDate.format(new Date(file.timeCreated))}${file?.teachers ? ` (${file.teachers} lærere)` : ""}`
              : "Ingen data",
          };
        })}
      />
    </div>
  );
}
