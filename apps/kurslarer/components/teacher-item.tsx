import React from "react";
import {
  Card,
  Details,
  DetailsContent,
  DetailsSummary,
  Heading,
  Paragraph,
  Tag,
} from "@digdir/designsystemet-react";
import {
  ChartBarIcon,
  GraduationCapIcon,
  MapPinAreaIcon,
} from "@phosphor-icons/react/ssr";

import { formatNumber } from "@/lib/format-number";

export interface TeacherData {
  id: string;
  name: string;
  courses: {
    id: string;
    name: string;
    date: string;
    organizer: string;
    curriculum: string;
    county: string;
  }[];
  studieplans?: string[];
}

function getTeacherCounties(teacher: Pick<TeacherData, "courses">): string[] {
  const counties = new Set<string>();
  for (const { county } of teacher.courses) {
    if (county) counties.add(county);
  }
  return [...counties].sort((a, b) => a.localeCompare(b, "nb"));
}

export function TeacherItem({ data }: { data: TeacherData }) {
  return (
    <Card>
      <Details>
        <DetailsSummary>
          <div>
            <Heading level={2}>{data.name}</Heading>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              <div className="flex gap-2">
                <ChartBarIcon className="shrink-0 mt-1" />{" "}
                {formatNumber(data.courses.length)} kurs
              </div>
              <div className="flex gap-2">
                <MapPinAreaIcon className="shrink-0 mt-1" />{" "}
                {getTeacherCounties(data).join(", ")}
              </div>
              {data.studieplans?.length && (
                <div className="flex gap-2">
                  <GraduationCapIcon className="shrink-0 mt-1" />{" "}
                  {data.studieplans.join(", ")}
                </div>
              )}
            </div>
          </div>
        </DetailsSummary>
        <DetailsContent>
          <ul className="flex flex-col gap-4">
            {data.courses.map((course) => (
              <li key={course.id} className="flex gap-2 items-start">
                <Tag data-size="lg">
                  {new Date(course.date).toLocaleDateString("no", {
                    month: "short",
                    year: "numeric",
                  })}
                </Tag>
                <div data-size="sm">
                  <Heading level={3}>{course.name}</Heading>
                  <Paragraph>
                    {course.organizer}
                    {course.curriculum && ` • ${course.curriculum}`}
                    {course.county && ` • ${course.county}`}
                  </Paragraph>
                </div>
              </li>
            ))}
          </ul>
        </DetailsContent>
      </Details>
    </Card>
  );
}
