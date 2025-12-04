"use client";

import { ChangeEvent, useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { CoursesParams } from "@/types/courses";
import getHref from "@/app/(studieforbund)/_helpers/getHref";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

interface SelectProps {
  options?: ([string, string] | string)[];
  propName: keyof CoursesParams;
}

export default function Select({
  options = [],
  propName,
  ...props
}: SelectProps) {
  const params = useParams<StudieforbundParams>();
  const prefix = usePathname()?.split("/", 2)[1] || "";
  const router = useRouter();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      router.push(getHref(prefix, params, { [propName]: e.target.value }));
    },
    [params, prefix, propName, router],
  );

  return (
    <select
      value={params[propName]}
      onChange={handleChange}
      className="mr-1 py-1 px-2 border bg-white rounded-md border-gray-300 shadow-sm focus:border-crimson-300 focus:ring focus:ring-crimson-200 focus:ring-opacity-50"
      {...props}
    >
      {options.map((opt) => {
        if (typeof opt === "string") return <option key={opt}>{opt}</option>;
        return (
          <option value={opt[0]} key={`${propName}-option-${opt[0]}`}>
            {opt[1]}
          </option>
        );
      })}
    </select>
  );
}
