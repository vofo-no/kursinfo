import { Article } from "@/components/article";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";

import { getAttestSlugs } from "../utils";
import { AttestSlugNext } from "./slug-next";
import { AttestSlugTracker } from "./slug-tracker";

export default async function MdxLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const slugs = getAttestSlugs(version);

  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Startsiden</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/attest">Kurslederattesten</BreadcrumbLink>
          </BreadcrumbItem>
          <AttestSlugTracker slugs={slugs} />
        </BreadcrumbList>
      </Breadcrumb>
      <Article>{children}</Article>
      <AttestSlugNext slugs={slugs} />
    </div>
  );
}
