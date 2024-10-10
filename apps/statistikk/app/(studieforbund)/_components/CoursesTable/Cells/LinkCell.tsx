"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { CoursesParams } from "@/types/courses";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

import getHref from "../../../_helpers/getHref";

export default function LinkCell({
  params,
  children,
}: PropsWithChildren<{ params: Partial<CoursesParams> }>) {
  const oldParams = useParams<StudieforbundParams>();
  const prefix = usePathname()?.split("/", 2)[1] || "";

  return <Link href={getHref(prefix, oldParams, params)}>{children}</Link>;
}
