import { INamed } from "../types";

function isNamed(item: any): item is INamed {
  return (item as INamed).name !== undefined;
}

export function showName(item: string | INamed) {
  if (isNamed(item)) {
    return (
      <>
        {item.name}
        {item.short && <small>{` (${item.short})`}</small>}
      </>
    );
  }
  return item;
}
