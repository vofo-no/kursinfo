import { Results } from "./results";
import { Search } from "./search";

export default async function SfMainPage({
  params,
  searchParams,
}: {
  params: Promise<{ sf: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const q = (await searchParams).q;
  const sf = (await params).sf;

  return (
    <div className="space-y-6">
      <Search query={q} />
      <Results query={q} sf={sf} />
    </div>
  );
}
