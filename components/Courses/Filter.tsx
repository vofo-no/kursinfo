import { Dispatch, FC } from "react";

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

const Select: FC<SelectProps> = ({ options = [], value, callback }) => (
  // eslint-disable-next-line jsx-a11y/no-onchange
  <select value={value} onChange={(e) => callback(e.target.value)}>
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

const Filter: FC<FilterProps> = ({
  county,
  countyOptions,
  organization,
  organizationOptions,
  setCounty,
  setOrganization,
  setYear,
  year,
  yearOptions,
}) => (
  <fieldset>
    <legend>Filter</legend>
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
    <style jsx>
      {`
        fieldset {
          border: 0;
          padding: 0;
          margin: 0;
        }
        fieldset legend {
          border: 0 !important;
          clip: rect(1px, 1px, 1px, 1px) !important;
          -webkit-clip-path: inset(50%) !important;
          clip-path: inset(50%) !important;
          height: 1px !important;
          margin: -1px !important;
          overflow: hidden !important;
          padding: 0 !important;
          position: absolute !important;
          width: 1px !important;
          white-space: nowrap !important;
        }
      `}
    </style>
  </fieldset>
);

export default Filter;
