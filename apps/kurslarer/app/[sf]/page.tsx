import { Suspense } from "react";
import { notFound } from "next/navigation";

import { parseSearch, type RawParams } from "@/lib/search-params";
import { sfNames } from "@/lib/sf";
import { getFilterOptions } from "@/lib/teachers";

import { Results } from "./results";
import { Search } from "./search";

export default function SfMainPage(props: {
  params: Promise<{ sf: string }>;
  searchParams: Promise<RawParams>;
}) {
  return (
    <Suspense fallback={<p>Laster …</p>}>
      <Content {...props} />
    </Suspense>
  );
}

async function Content({
  params,
  searchParams,
}: {
  params: Promise<{ sf: string }>;
  searchParams: Promise<RawParams>;
}) {
  const { sf } = await params;
  if (![...sfNames.keys()].includes(sf)) notFound();

  const options = await getFilterOptions(sf);
  const search = parseSearch(await searchParams, options);

  return (
    <div className="space-y-6">
      <Search {...options} />
      <Suspense fallback={<p>Søker …</p>}>
        <Results sf={sf} search={search} />
      </Suspense>
    </div>
  );
}
