"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBlob, ref } from "firebase/storage";
import { CloudDownloadIcon, LoaderCircleIcon } from "lucide-react";

import { storage } from "@/lib/firebase/clientApp";
import { getTeachersDataUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/components/auth/auth-context";

import { updateTeachers } from "../actions/updateTeachers";
import { Teacher } from "../types";
import { columns } from "./columns";
import { dates, monthFormat } from "./helper";

export const maxDuration = 360;

const numberFormat = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
});

export default function TeachersPage() {
  const searchParams = useSearchParams();
  const monthIndex = searchParams.get("d") || "0";
  const datesIndex = useMemo(() => dates, []);
  const currentDate = datesIndex[Number(monthIndex)];

  const [loading, setLoading] = useState(true);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    setLoading(false);
  }, [teachersData]);

  useEffect(() => {
    if (user && user.customClaims.scope) {
      setLoading(true);

      const pathReference = ref(
        storage,
        getTeachersDataUrl(
          user.customClaims.scope,
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
        ),
      );

      const fetchBlob = async () => {
        try {
          const blob = await getBlob(pathReference);
          return JSON.parse(await blob.text());
        } catch {
          return [];
        }
      };
      fetchBlob()
        .then(setTeachersData)
        .finally(() => setLoading(false));
    }
  }, [currentDate, user]);

  const updateTeachersHandler = async () => {
    setLoading(true);

    try {
      const nextTeachers = await updateTeachers(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
      );
      setTeachersData(nextTeachers);
    } finally {
      setLoading(false);
    }
  };

  const numberOfTeachers = teachersData.length;
  const avgAge =
    currentDate.getFullYear() -
    teachersData.map((t) => t.yearOfBirth).reduce((a, b) => a + b, 0) /
      numberOfTeachers;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>
            Studieforbundets kurslærere i {monthFormat.format(currentDate)}
          </CardTitle>
          <CardDescription className="text-balance max-w-lg leading-relaxed">
            Tabellen under viser lærere på kurs som er avsluttet i{" "}
            {monthFormat.format(currentDate)}.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={updateTeachersHandler}
            disabled={loading}
            className={loading ? "animate-bounce" : ""}
          >
            <span className="flex gap-2">
              {loading
                ? [
                    <LoaderCircleIcon
                      className="animate-spin"
                      key="updTButtonIconLoading"
                    />,
                    "Oppdaterer lærere...",
                  ]
                : [
                    <CloudDownloadIcon key="updTButtonIcon" />,
                    "Oppdater lærere",
                  ]}
            </span>
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Antall lærere</CardDescription>
          <CardTitle className="text-4xl">
            {numberFormat.format(numberOfTeachers)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Snittalder</CardDescription>
          <CardTitle className="text-4xl">
            {numberFormat.format(avgAge)} år
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="col-span-full">
        <CardHeader className="px-7">
          <CardTitle>Kurslærere</CardTitle>
          <CardDescription>Lærere på kurs i studieforbundet.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={teachersData} />
        </CardContent>
      </Card>
    </div>
  );
}
