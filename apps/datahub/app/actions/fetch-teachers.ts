"use server";

import eapply from "@kursinfo/eapply-sdk";
import { getTenantId } from "@kursinfo/julien";
import { metaphone } from "metaphone";

import { getTokensFromCookies } from "@/lib/get-tokens-from-cookies";
import { mergeTeachers } from "@/lib/teachers";
import { toUser } from "@/lib/user";

import { Teacher } from "../types";

export async function fetchTeachers(ids: string[]) {
  const tokens = await getTokensFromCookies();
  const user = tokens ? toUser(tokens) : null;
  const { scope } = user?.customClaims || {};

  if (!scope) throw "Not allowed";

  const tenantId = getTenantId(scope);

  if (!tenantId) throw "Missing configuration";

  const teachers: Teacher[] = [];

  const client = eapply(tenantId);

  await Promise.all(
    ids.map(async (id) => {
      const documents = await client.getCaseDocuments(id);

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

          const teacherKey = [
            teacher.yearOfBirth,
            teacher.gender.substring(0, 1),
            teacher.zip,
            metaphone(name[name.length - 1]),
            metaphone(name[0]),
          ].join(":");

          const reportSubject = [
            report.course?.coursePlanCode,
            report.course?.coursePlanTitle,
          ].join(" ");

          teachers.push({
            id: teacherKey,
            name: teacher.name,
            yearOfBirth: teacher.yearOfBirth,
            gender: teacher.gender,
            zip: teacher.zip,
            emailAddress: teacher.emailAddress,
            phoneNumber: teacher.phoneNumber,
            courses: [report.caseNumber],
            subjects: [reportSubject],
          });
        });
    }),
  );

  return Object.values(mergeTeachers(teachers));
}
