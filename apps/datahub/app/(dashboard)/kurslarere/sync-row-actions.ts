"use server";

import { getFeatureSettings } from "@kursinfo/db";
import { db } from "@kursinfo/db/client";
import {
  CourseSyncData,
  getTeacherKey,
  syncCoursesForMonth,
} from "@kursinfo/db/sync";
import eapply from "@kursinfo/eapply-sdk";
import {
  getTenantDataUrl,
  getTenantId,
  uncompressTenantData,
} from "@kursinfo/julien";
import { CourseStatuses } from "@kursinfo/julien/constants";
import { neonAuth } from "@neondatabase/neon-js/auth/next";

import { SyncRowDataItem } from "./types";

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function assertMonth(month: string) {
  if (!MONTH_PATTERN.test(month)) throw new Error("Invalid month.");
}

function teacherKeySecret() {
  const secret = process.env.TEACHER_KEY_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TEACHER_KEY_SECRET is missing or too short.");
  }
  return secret;
}

async function requireFeatureSettings() {
  const { session } = await neonAuth();
  const featureSettings = await getFeatureSettings("kurslarer", session);
  if (!featureSettings) {
    throw new Error(
      "Feature 'kurslarer' is not enabled for this organization.",
    );
  }
  return featureSettings;
}

// null for names without usable letters (the key function throws for those)
function tryTeacherKey(secret: string, name: string, ...parts: string[]) {
  try {
    return getTeacherKey(secret, name, ...parts);
  } catch {
    return null;
  }
}

export async function fetchCoursesAction(
  dataScope: string,
  month: string,
): Promise<SyncRowDataItem[]> {
  const featureSettings = await requireFeatureSettings();
  if (dataScope !== featureSettings.dataScope) {
    throw new Error("Invalid dataScope provided.");
  }
  assertMonth(month);

  const dataUrl = getTenantDataUrl(dataScope, month.substring(0, 4));
  const data = await fetch(dataUrl)
    .then((res) => res.text())
    .then(uncompressTenantData);

  return data.items
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
      organization: data.organizations[Number(item.organizationCode)] || "",
      organizer: data.organizers[item.organizerIndex] || "",
      county: data.counties[item.countyIndex] || "",
      date: item.endDate || "",
    }));
}

export async function getSyncDataAction(
  settings: { dbScope: string; dataScope: string },
  dataItems: SyncRowDataItem[],
): Promise<CourseSyncData[]> {
  const featureSettings = await requireFeatureSettings();
  if (settings.dataScope !== featureSettings.dataScope) {
    throw new Error("Invalid dataScope provided.");
  }

  const tenantId = getTenantId(settings.dataScope);
  if (!tenantId) throw "Missing configuration";

  const secret = teacherKeySecret();
  const client = eapply(tenantId);
  const syncData: CourseSyncData[] = [];

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

      if (!report) return;
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

          const fullName = name.join(" ");
          const teacherKey = tryTeacherKey(
            secret,
            fullName,
            String(teacher.yearOfBirth),
            teacher.gender.substring(0, 1),
            teacher.zip,
          );
          if (!teacherKey) return;

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
  const featureSettings = await requireFeatureSettings();
  if (settings.dbScope !== featureSettings.dbScope) {
    throw new Error("Invalid dbScope provided.");
  }
  assertMonth(month);

  if (syncData.some((row) => !row.date.startsWith(`${month}-`))) {
    throw new Error("Rows outside the synced month.");
  }

  await syncCoursesForMonth(
    db,
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
