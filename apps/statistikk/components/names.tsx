import { ReactNode } from "react";

import { INamed } from "@/types/reports";

function isNamed(item: unknown): item is INamed {
  return (item as INamed).name !== undefined;
}

export function showName(item: string | INamed, key?: string): ReactNode {
  if (isNamed(item)) {
    return (
      <>
        {item.name}
        {item.short && (
          <small className="text-opacity-60 font-normal text-gray-500">{` (${item.short})`}</small>
        )}
      </>
    );
  }
  return typeof item === "string" ? item : key || "(ukjent)";
}
