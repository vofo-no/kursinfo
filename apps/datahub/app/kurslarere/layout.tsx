"use client";

import { PropsWithChildren } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { dates, monthFormat } from "./helper";

export default function TeachersLayout({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const monthKey = searchParams.get("d") || "0";

  function setMonthKey(value: string) {
    const nextParams = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== "0") nextParams.set("d", value);
    else {
      nextParams.delete("d");
    }
    router.push([pathname, nextParams.toString()].filter(Boolean).join("?"));
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Select value={monthKey} onValueChange={setMonthKey}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {dates.map((d, i) => (
            <SelectItem value={String(i)} key={`selectItem.${d}`}>
              {monthFormat.format(d)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {children}
    </main>
  );
}
