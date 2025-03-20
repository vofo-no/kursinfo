"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { getNavMain } from "@/lib/nav-main";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const path = usePathname();
  const { scope } = useParams<{ scope: string }>();
  const navMain = getNavMain(scope);

  const navMainItem = navMain.find((item) => path.startsWith(item.url));
  const navSubItem = navMainItem?.items
    .slice()
    .sort((a, b) => b.url.length - a.url.length)
    .find((item) => path.startsWith(item.url));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Datahub</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {navMainItem && navSubItem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={navMainItem.url}>{navMainItem.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {(navMainItem || navSubItem) && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {navSubItem?.title || navMainItem?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
