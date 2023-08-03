import "server-only";

import getCountiesIO from "lib/getCounties";
import { cache } from "react";

export const preload = (year: string) => {
  void getCounties(year);
};

export const getCounties = cache(async (year: string) => {
  return getCountiesIO(year);
});
