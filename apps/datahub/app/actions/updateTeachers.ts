"use server";

import eapply from "@kursinfo/eapply-sdk";
import {
  getTenantDataUrl,
  getTenantId,
  uncompressTenantData,
} from "@kursinfo/julien";
import { CourseStatuses } from "@kursinfo/julien/constants";
import { metaphone } from "metaphone";

import { putFileForTenant } from "@/lib/firebase/admin";
import { userFromCookies } from "@/components/auth/user-from-cookies";

import { Teacher } from "../types";

export async function updateTeachers(year: number, month: number) {
  const user = await userFromCookies();
  const scope = user?.customClaims.scope;

  if (!scope) throw "Not allowed";
  if (year < 2020 || year > new Date().getFullYear()) throw "Invalid year arg";
  if (month < 1 || month > 12) throw "Invalid month arg";

  const yearAndMonth = `${year}-${month.toString().padStart(2, "0")}`;
  const tenantId = getTenantId(scope);

  if (!tenantId) throw "Missing configuration";

  const coursesData = await fetch(getTenantDataUrl(scope, String(year)))
    .then((res) => res.text())
    .then(uncompressTenantData);

  const ids = coursesData.items
    .filter(
      (item) =>
        item.hasTeacher &&
        item.status === CourseStatuses.DONE &&
        item.endDate?.startsWith(`${yearAndMonth}-`),
    )
    .map((item) => item.ID);

  const teacherIndex: Record<string, Teacher> = {};

  const client = eapply(tenantId);

  const taskName = `⚙ Oppdatert kurslærere for ${scope} i ${yearAndMonth} (${ids.length} kurs)`;
  console.time(taskName);

  const STEP = 50;
  for (let i = 0; i * STEP < ids.length; i++) {
    const firstIndex = i * STEP;
    const lastIndex = firstIndex + STEP;
    console.log(`Henter kurs ${firstIndex + 1}-${lastIndex}...`);
    await Promise.all(
      ids.slice(firstIndex, lastIndex).map(async (id) => {
        const documents = await client.getCaseDocuments(id);

        const reports = (documents || []).filter(
          (doc) => doc.formType === "Report",
        );

        const report =
          reports.length &&
          reports.reduce((prev, current) =>
            prev && prev.revisionNumber > current.revisionNumber
              ? prev
              : current,
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

            const teacherKey = [
              teacher.yearOfBirth,
              teacher.gender.substring(0, 1),
              teacher.zip,
              metaphone(name[name.length - 1]),
              metaphone(name[0]),
            ].join(":");

            const record = teacherIndex[teacherKey];

            teacherIndex[teacherKey] = record
              ? {
                  ...record,
                  emailAddress: record.emailAddress || teacher.emailAddress,
                  phoneNumber: record.phoneNumber || teacher.phoneNumber,
                  courses: [
                    ...record.courses.filter((c) => c !== report.caseNumber),
                    report.caseNumber,
                  ],
                }
              : {
                  id: teacherKey,
                  name: teacher.name,
                  yearOfBirth: teacher.yearOfBirth,
                  gender: teacher.gender,
                  zip: teacher.zip,
                  emailAddress: teacher.emailAddress,
                  phoneNumber: teacher.phoneNumber,
                  courses: [report.caseNumber],
                };
          });
      }),
    );
  }

  const teachers = Object.values(teacherIndex);

  putFileForTenant(scope, year, month, JSON.stringify(teachers));

  console.log(`💾 Lastet opp ${teachers.length} lærere`);
  console.timeEnd(taskName);

  return teachers;
}
