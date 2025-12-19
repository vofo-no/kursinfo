import { getTeachersMatchingQuery } from "@kursinfo/db";

import { ItemGroup } from "@/components/ui/item";
import { TeacherData, TeacherItem } from "@/components/teacher-item";

export async function Results({ sf, query }: { sf: string; query?: string }) {
  if (!query) return <p>Søk da!</p>;

  const data = await getTeachersMatchingQuery(sf, query);

  // Transform data into TeacherData[]
  // Group by teacher, counting courses and collecting studieplans
  const teacherMap: Map<string, TeacherData> = new Map();

  data.forEach(({ teachers, courses }) => {
    const { id, name } = teachers;
    if (!teacherMap.has(id)) {
      teacherMap.set(id, {
        id,
        name,
        courses: [
          {
            id: String(courses.id),
            name: courses.title,
            date: courses.date,
            organizer: courses.organizer,
            curriculum: courses.curriculum,
            county: courses.county,
          },
        ],
        studieplans: courses.curriculum ? [courses.curriculum] : [],
      });
    } else {
      const entry = teacherMap.get(id)!;
      entry.courses.push({
        id: String(courses.id),
        name: courses.title,
        date: courses.date,
        organizer: courses.organizer,
        curriculum: courses.curriculum,
        county: courses.county,
      });
      if (
        courses.curriculum &&
        !entry.studieplans?.includes(courses.curriculum)
      ) {
        entry.studieplans?.push(courses.curriculum);
      }
    }
  });

  const teachers = Array.from(teacherMap.values());

  return (
    <div className="space-y-6">
      <p>
        Fant {teachers.length.toLocaleString("no-NB")} resultater for{" "}
        <strong>{query}</strong>.
      </p>
      <div className="flex w-full flex-col gap-6">
        <ItemGroup>
          {teachers.map((teacher, index) => (
            <TeacherItem key={teacher.id} data={teacher} index={index} />
          ))}
        </ItemGroup>
      </div>
    </div>
  );
}
