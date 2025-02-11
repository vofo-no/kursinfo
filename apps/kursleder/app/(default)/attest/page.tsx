import { ArrowRightIcon } from "lucide-react";

import { Article } from "@/components/article";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";
import { LinkButton } from "@/components/link-button";

import { getAttestVersions } from "./utils";

export default async function Home() {
  const versions = getAttestVersions();

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Startsiden</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Kurslederattesten</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <Article>
        <h1>Kurslederattesten</h1>
        <p className="lead">
          Attesten gir lærere og kursledere et felles utgangspunkt for å skape
          gode og trygge kurs. Du kan ta den på egenhånd når det passer for deg.
        </p>
      </Article>
      <div className="grid gap-4 w-full max-w-2xl">
        <LinkButton
          href={`/attest/${versions[versions.length - 1]}`}
          className="justify-between items-center group"
        >
          <h3 className="text-lg font-semibold">Ta kurslederattesten nå</h3>
          <ArrowRightIcon className="group-hover:translate-x-2 transition" />
        </LinkButton>
      </div>
    </div>
  );
}
