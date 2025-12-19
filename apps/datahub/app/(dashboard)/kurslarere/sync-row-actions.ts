"use server";

import {
  CourseSyncData,
  getFeatureSettings,
  syncCoursesForMonth,
} from "@kursinfo/db";
import eapply from "@kursinfo/eapply-sdk";
import {
  getTenantDataUrl,
  getTenantId,
  uncompressTenantData,
} from "@kursinfo/julien";
import { CourseStatuses } from "@kursinfo/julien/constants";
import { neonAuth } from "@neondatabase/neon-js/auth/next";

import { getTeacherKey } from "@/lib/teacher-key";

import { SyncRowDataItem } from "./types";

export async function fetchCoursesAction(
  dataScope: string,
  month: string,
): Promise<SyncRowDataItem[]> {
  const dataUrl = getTenantDataUrl(dataScope, month.substring(0, 4));
  const data = await fetch(dataUrl)
    .then((res) => res.text())
    .then(uncompressTenantData);

  const dataItems = data.items
    .filter(
      (item) =>
        item.hasTeacher &&
        item.status === CourseStatuses.DONE &&
        item.endDate?.startsWith(`${month}-`),
    )
    .map((item) => ({
      courseId: Number(item.ID),
      title: item.title,
      curriculum: data.curriculums[item.curriculumIndex] || "",
      organizer: data.organizers[item.organizerIndex] || "",
      county: data.counties[item.countyIndex] || "",
      date: item.endDate || "",
    }));

  return dataItems;
}

export async function getSyncDataAction(
  settings: { dbScope: string; dataScope: string },
  dataItems: SyncRowDataItem[],
): Promise<CourseSyncData[]> {
  const { session } = await neonAuth();
  const featureSettings = await getFeatureSettings("kurslarer", session);

  if (!featureSettings) {
    throw new Error(
      "Feature 'kurslarer' is not enabled for this organization.",
    );
  }

  if (settings.dataScope !== featureSettings.dataScope) {
    throw new Error("Invalid dataScope provided.");
  }

  const tenantId = getTenantId(settings.dataScope);

  if (!tenantId) throw "Missing configuration";

  const syncData: CourseSyncData[] = [];

  const client = eapply(tenantId);

  await Promise.all(
    dataItems.map(async (item) => {
      const documents = await client.getCaseDocuments(String(item.courseId));

      const reports = (documents || []).filter(
        (doc) => doc.formType === "Report",
      );

      const report =
        reports.length &&
        reports.reduce((prev, current) =>
          prev && prev.revisionNumber > current.revisionNumber ? prev : current,
        );

      if (!report) return Promise.resolve();
      // Ensure the course is owned by current tenant
      if (report.course?.tenantId !== tenantId) return;

      report.participants
        .filter((person) => person.roleCode === "Teacher")
        .forEach((teacher) => {
          const name = String(teacher.name)
            .split(" ")
            .map((str) => str.trim())
            .filter(Boolean);

          // Requirements for indexing:
          // 1) first and last name
          // 2) year of birth
          // 3) gender
          // 4) zip code
          if (
            name.length < 2 ||
            !teacher.gender ||
            !teacher.yearOfBirth ||
            !teacher.zip
          )
            return;

          const teacherKey = getTeacherKey(
            name[0] || "",
            name[name.length - 1] || "",
            String(teacher.yearOfBirth),
            teacher.gender.substring(0, 1),
            teacher.zip,
          );

          syncData.push({
            ...item,
            scope: settings.dbScope,
            teacherId: teacherKey,
            teacherName: name.join(" "),
          });
        });
    }),
  );

  return syncData;
}

export async function syncDataToDbAction(
  settings: { dbScope: string; dataScope: string },
  month: string,
  syncData: CourseSyncData[],
): Promise<{
  month: string;
  teacherCount: number;
  syncedAt: Date;
}> {
  const { session } = await neonAuth();
  const featureSettings = await getFeatureSettings("kurslarer", session);

  if (!featureSettings) {
    throw new Error(
      "Feature 'kurslarer' is not enabled for this organization.",
    );
  }

  if (settings.dbScope !== featureSettings.dbScope) {
    throw new Error("Invalid dbScope provided.");
  }

  await syncCoursesForMonth(
    settings.dbScope,
    Number(month.substring(0, 4)),
    Number(month.substring(5, 7)),
    syncData,
  );

  return {
    month,
    teacherCount: syncData.length,
    syncedAt: new Date(),
  };
}
