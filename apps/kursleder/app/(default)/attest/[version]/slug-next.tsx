"use client";

import { useParams } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { LinkButton } from "@/components/link-button";

export function AttestSlugNext({ slugs }: { slugs: string[] }) {
  const { slug, version } = useParams<{ slug: string; version: string }>();

  const currentSlugIndex = slugs.findIndex((str) => str == slug);
  const nextSlug = slugs[currentSlugIndex + 1];

  return (
    <div className="not-prose w-full flex justify-end">
      <LinkButton
        href={
          nextSlug
            ? `/attest/${version}/${slugs[currentSlugIndex + 1]}`
            : "/attest"
        }
        className="justify-between items-center group"
      >
        <h3 className="text-lg font-semibold">
          {nextSlug ? "Fortsett" : "Fullfør"}
        </h3>
        <ArrowRightIcon className="group-hover:translate-x-2 transition" />
      </LinkButton>
    </div>
  );
}
