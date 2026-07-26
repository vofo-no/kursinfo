"use client";

import React from "react";
import { afterMaxLastYear } from "@kursinfo/julien";

import Select from "./Select";

interface SelectYearProps {
  firstYear?: number;
}

export function SelectYear({ firstYear }: SelectYearProps) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear + (afterMaxLastYear() ? 1 : 0);
  const start = firstYear || currentYear;
  const options = Array.from({ length: lastYear - start + 1 }, (_, index) =>
    String(start + index),
  );

  return <Select aria-label="Velg årstall" options={options} propName="year" />;
}
