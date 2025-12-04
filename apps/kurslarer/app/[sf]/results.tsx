import { ItemGroup } from "@/components/ui/item";
import { TeacherData, TeacherItem } from "@/components/teacher-item";

export function Results({ query }: { query?: string }) {
  if (!query) return <p>Søk da!</p>;

  const teachers: TeacherData[] = [
    {
      id: "123",
      name: "Hipp Hurra",
      avatar: "https://github.com/mgrim.png",
      courses: 12,
      studieplans: [
        "11232 Pjoning på hesteryggen",
        "123522 Hipp hopp hurra",
        "12523 Organisasjon for alle penga",
      ],
    },
    {
      id: "233",
      name: "Snurre Sprett Hurra",
      avatar: "https://github.com/mgrim.png",
      courses: 2,
      studieplans: [
        "11232 Pjoning på hesteryggen",
        "123522 Hipp hopp hurra",
        "12523 Organisasjon for alle penga",
      ],
    },
    {
      id: "333",
      name: "Test Person",
      avatar: "https://github.com/mgrim.png",
      courses: 1224,
      studieplans: [
        "11232 Pjoning på hesteryggen",
        "123522 Hipp hopp hurra",
        "12523 Organisasjon for alle penga",
        "0223 Dra meg nå baklengs inn i fuglekassa",
      ],
    },
    {
      id: "422",
      name: "Jens!",
      avatar: "https://github.com/mgrim.png",
      courses: 42,
      studieplans: [
        "11232 Pjoning på hesteryggen",
        "123522 Hipp hopp hurra",
        "12523 Organisasjon for alle penga",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <p>
        Minst 1 000 resultater for <strong>{query}</strong>.
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
