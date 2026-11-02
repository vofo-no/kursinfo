import { Suspense } from "react";

import type { ParsedSearch } from "@/lib/search-params";
import { searchTeachers } from "@/lib/teachers";
import { TeacherItem } from "@/components/teacher-item";

export async function Results({
  sf,
  search,
}: {
  sf: string;
  search: ParsedSearch;
}) {
  if (!search.query && !search.county.length && !search.organization.length) {
    return <p>Søk, velg fylke eller organisasjon.</p>;
  }

  return (
    <Suspense
      key={[search.query, search.county, search.organization].flat().join("::")}
      fallback={"Søker ..."}
    >
      <CachedResults sf={sf} search={search} />
    </Suspense>
  );
}

async function CachedResults({
  sf,
  search,
}: {
  sf: string;
  search: ParsedSearch;
}) {
  "use cache";
  const teachers = await searchTeachers(sf, search);

  if (!teachers.length)
    return (
      <div className="space-y-6">
        <p>Fant ingen kurslærere.</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <p>
        Viser {teachers.length.toLocaleString("nb-NO")} kurslærer
        {teachers.length > 1 && "e"}.
      </p>
      <div className="space-y-4">
        {teachers.map((teacher) => (
          <TeacherItem key={teacher.id} data={teacher} />
        ))}
      </div>
    </div>
  );
}
