import { Dispatch, FC } from "react";

import { ICoursesBaseProps } from "./constants";

interface SelectProps {
  options?: (string[] | string)[];
  value?: string;
  callback: Dispatch<string>;
}

interface FilterProps extends ICoursesBaseProps {
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
  </fieldset>
);

export default Filter;
