import "server-only";

import { cache } from "react";

import getCountiesIO from "@/lib/getCounties";

export const preload = (year: string) => {
  void getCounties(year);
};

export const getCounties = cache(async (year: string) => {
  return getCountiesIO(year);
});
