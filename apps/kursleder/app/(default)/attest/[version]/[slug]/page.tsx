import { getAttestSlugs, getAttestVersions } from "../../utils";

interface PageParams {
  version: string;
  slug: string;
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, version } = await params;
  const { default: Post } = await import(
    `@/content/attest/${version}/${slug}.mdx`
  );

  return <Post />;
}

export function generateStaticParams() {
  const versions = getAttestVersions();

  const params: PageParams[] = [];

  versions.forEach((version) => {
    params.push(...getAttestSlugs(version).map((slug) => ({ slug, version })));
  });

  return params;
}

export const dynamicParams = false;
