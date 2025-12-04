export default async function TeacherPage({
  params,
}: {
  params: Promise<{ sf: string; teacher: string }>;
}) {
  const { sf, teacher } = await params;
  return (
    <h1>
      {sf} / {teacher}
    </h1>
  );
}
