"use client";

import injectDefaultParams from "app/(studieforbund)/_helpers/injectDefaultParams";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { CoursesParams } from "types/courses";

import getHref from "../../app/(studieforbund)/_helpers/getHref";

export default function LinkCell({
  params,
  children,
}: PropsWithChildren<{ params: Partial<CoursesParams> }>) {
  const prefix = usePathname()?.split("/", 2)[1] || "";
  const oldParams = injectDefaultParams(useParams());

  return <Link href={getHref(prefix, oldParams, params)}>{children}</Link>;
}
