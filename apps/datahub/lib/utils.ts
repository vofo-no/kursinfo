import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTeachersDataUrl(
  scope: string,
  year: number,
  month?: number,
) {
  return `${scope}/${year}-${String(month).padStart(2, "0")}.json`;
}
