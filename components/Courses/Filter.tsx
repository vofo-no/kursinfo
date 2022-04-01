import { Dispatch } from "react";

import { CoursesProps } from "./constants";

interface SelectProps {
  options?: (string[] | string)[];
  value?: string;
  callback: Dispatch<string>;
}

interface FilterProps
  extends Pick<
    CoursesProps,
    | "county"
    | "countyOptions"
    | "organization"
    | "organizationOptions"
    | "year"
    | "yearOptions"
  > {
  setYear: Dispatch<string>;
  setCounty: Dispatch<string>;
  setOrganization: Dispatch<string>;
}

const Select = ({ options = [], value, callback }: SelectProps) => (
  // eslint-disable-next-line jsx-a11y/no-onchange
  <select
    value={value}
    onChange={(e) => callback(e.target.value)}
    className="mr-1 py-1 px-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  >
    {options.map((opt) => {
      if (typeof opt === "string") return <option key={opt}>{opt}</option>;
      return (
        <option value={opt[0]} key={opt[0]}>
          {opt[1]}
        </option>
      );
    })}
  </select>
);

const Filter = ({
  county,
  countyOptions,
  organization,
  organizationOptions,
  setCounty,
  setOrganization,
  setYear,
  year,
  yearOptions,
}: FilterProps) => (
  <fieldset className="my-3">
    <legend className="sr-only">Filter</legend>
    <Select
      aria-label="Velg årstall"
      value={year}
      options={yearOptions}
      callback={setYear}
    />
    <Select
      aria-label="Velg organisasjon"
      value={organization}
      options={organizationOptions}
      callback={setOrganization}
    />
    <Select
      aria-label="Velg fylke"
      value={county}
      options={countyOptions}
      callback={setCounty}
    />
  </fieldset>
);

export default Filter;
