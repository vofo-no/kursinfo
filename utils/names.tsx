import { INamed } from "../types";
import { Text } from "@vofo-no/design";

function isNamed(item: any): item is INamed {
  return (item as INamed).name !== undefined;
}

export function showName(item: string | INamed) {
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
