"use client";

import { useEffect, useMemo, useState } from "react";
import { getMetadata, list, ref, StorageReference } from "firebase/storage";
import { CogIcon } from "lucide-react";

import { storage } from "@/lib/firebase/clientApp";
import { formatDate } from "@/lib/intl";
import { useAuth } from "@/components/auth/auth-context";

import { DatafilesForm } from "./datafiles-form";
import { DatafilesUpdate } from "./datafiles-update";
import { getDates, getMonthKey, monthFormat } from "./helper";

interface DatafileMeta {
  name: string;
  timeCreated: string;
  size: number;
  teachers?: string;
}

async function fetchFilesList(pathReference: StorageReference) {
  try {
    const files = await list(pathReference, { maxResults: 100 }).then(
      (result) =>
        Promise.all(
          result.items.map((item) =>
            getMetadata(item).then(
              ({ name, timeCreated, size, customMetadata }) => ({
                name,
                timeCreated,
                size,
                teachers: customMetadata?.teachers,
              }),
            ),
          ),
        ),
    );
    return files;
  } catch {
    return [];
  }
}

export function Datafiles() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<DatafileMeta[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const datesIndex = useMemo(() => getDates(), []);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.customClaims.scope && tasks.length === 0) {
      setLoading(true);

      const pathReference = ref(storage, `${user.customClaims.scope}/`);
      fetchFilesList(pathReference)
        .then(setFiles)
        .finally(() => setLoading(false));
    }
  }, [user, tasks]);

  if (loading)
    return (
      <div className="h-20 flex justify-center items-center">
        <CogIcon className="text-muted-foreground animate-spin h-8 w-8" />
      </div>
    );

  if (tasks.length) {
    return <DatafilesUpdate tasks={tasks} />;
  }

  return (
    <div className="overflow-auto">
      <DatafilesForm
        submitHandler={setTasks}
        items={datesIndex.map((d) => {
          const key = getMonthKey(d);
          const file = files.find((file) => file.name.startsWith(key));
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
