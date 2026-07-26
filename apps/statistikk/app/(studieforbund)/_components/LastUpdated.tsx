"use client";

import { useParams } from "next/navigation";

import { formatBuildDateTime } from "@/lib/intl";

import { useStatistikkQuery } from "../_hooks/use-statistikk-query";
import { StudieforbundParams } from "../types";

interface Props {
  tenant: string;
}

export function LastUpdated({ tenant }: Props) {
  const { year } = useParams<StudieforbundParams>();
  const { data, isLoading, error } = useStatistikkQuery({ year, tenant });

  if (isLoading) return "...";
  if (error || !data?.buildTime) return null;

  return <>Sist oppdatert {formatBuildDateTime(Date.parse(data.buildTime))}</>;
}
