import { Text } from "@vofo-no/design";
import { ReactNode } from "react";

import { INamed } from "../types";

function isNamed(item: unknown): item is INamed {
  return (item as INamed).name !== undefined;
}

export function showName(item: string | INamed): ReactNode {
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
  return item;
}
