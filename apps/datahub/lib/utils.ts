import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrUnique<T>(arr: T[]) {
  return arr.filter((v, i, a) => a.indexOf(v) == i);
}
