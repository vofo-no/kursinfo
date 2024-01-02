"use client";

import { StudieforbundParams } from "app/(studieforbund)/types";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { CoursesParams } from "types/courses";

import getHref from "../../../_helpers/getHref";

export default function LinkCell({
  params,
  children,
}: PropsWithChildren<{ params: Partial<CoursesParams> }>) {
  const oldParams = useParams<StudieforbundParams>();
  const prefix = usePathname()?.split("/", 2)[1] || "";

  return <Link href={getHref(prefix, oldParams, params)}>{children}</Link>;
}
