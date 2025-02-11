"use client";

import { useParams } from "next/navigation";

import { BreadcrumbPage, BreadcrumbSeparator } from "@/components/breadcrumbs";

export function AttestSlugTracker({ slugs }: { slugs: string[] }) {
  const { slug } = useParams<{ slug: string }>();

  const currentSlugIndex = slugs.findIndex((str) => str == slug);

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbPage>
        {currentSlugIndex < 0
          ? "Introduksjon"
          : `${currentSlugIndex + 1} av ${slugs.length}`}
      </BreadcrumbPage>
    </>
  );
}
