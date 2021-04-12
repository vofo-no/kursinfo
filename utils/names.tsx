import { Text } from "@vofo-no/design";
import { ReactNode } from "react";
import { INamed } from "types/reports";

function isNamed(item: unknown): item is INamed {
  return (item as INamed).name !== undefined;
}

export function showName(item: string | INamed, key?: string): ReactNode {
  if (isNamed(item)) {
    return (
      <>
        {item.name}
        {item.short && (
          <Text
            as="small"
            color="gray"
            fontSize="small"
          >{` (${item.short})`}</Text>
        )}
      </>
    );
  }
  return typeof item === "string" ? item : key || "(ukjent)";
}
