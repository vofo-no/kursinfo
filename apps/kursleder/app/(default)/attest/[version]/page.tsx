import { getAttestVersions } from "../utils";

interface PageParams {
  version: string;
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { version } = await params;
  const { default: Post } = await import(
    `@/content/attest/${version}/index.mdx`
  );

  return <Post />;
}

export function generateStaticParams() {
  return getAttestVersions().map((version) => ({ version }));
}

export const dynamicParams = false;
