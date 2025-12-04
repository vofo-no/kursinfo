import { Results } from "./results";
import { Search } from "./search";

export default async function SfMainPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const q = (await searchParams).q;
  return (
    <div className="space-y-6">
      <Search query={q} />
      <Results query={q} />
    </div>
  );
}
