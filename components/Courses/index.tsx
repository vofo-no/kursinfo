import { Dispatch, FC, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { GroupType } from "./constants";
import Table from "../Table";
import { Box, Text } from "@vofo-no/design";
import ExportSchema from "./ExportSchema";
import AlertDialog from "../AlertDialog";
import { Info } from "react-feather";

interface CommonProps {
  county: string;
  countyOptions: string[][];
  organizationOptions: string[][];
  year: string;
  yearOptions: string[];
}

interface FilterProps extends CommonProps {
  setGroup: Dispatch<GroupType>;
  setYear: Dispatch<string>;
  setCounty: Dispatch<string>;
  setOrganization: Dispatch<string>;
  organization?: string;
}

interface CoursesProps extends CommonProps {
  group: GroupType;
  counties: string[];
  curriculums: string[];
  organizers: string[];
  items: any[];
  reportSchema?: string;
}

interface SelectProps {
  options?: (string[] | string)[];
  value?: string;
  callback: Dispatch<string>;
}

const Select: FC<SelectProps> = ({ options = [], value, callback }) => (
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

const Filter: FC<FilterProps> = (props) => (
  <fieldset>
    <legend>Filter</legend>
    <Select
      aria-label="Velg årstall"
      value={props.year}
      options={props.yearOptions}
      callback={props.setYear}
    />
    <Select
      aria-label="Velg organisasjon"
      value={props.organization}
      options={props.organizationOptions}
      callback={props.setOrganization}
    />
    <Select
      aria-label="Velg fylke"
      value={props.county}
      options={props.countyOptions}
      callback={props.setCounty}
    />
  </fieldset>
);

interface GroupItemProps {
  value: GroupType;
  label: string;
  selected: GroupType;
  callback: Dispatch<string>;
}

const GroupItem = ({ value, label, selected, callback }: GroupItemProps) => (
  <label>
    <input
      type="radio"
      value={value}
      id={value}
      checked={value === selected}
      onChange={(e) => callback(e.target.value)}
    />
    <label htmlFor={value}>{label}</label>
  </label>
);

const GroupTabs = ({ group, setGroup }) => (
  <fieldset>
    <legend>Grupper etter</legend>
    <GroupItem
      callback={setGroup}
      label="(ingen)"
      selected={group}
      value={"kurs"}
    />
    <GroupItem
      callback={setGroup}
      label="Fylke"
      selected={group}
      value="fylker"
    />
    <GroupItem
      callback={setGroup}
      label="Arrangør"
      selected={group}
      value="lag"
    />
    <GroupItem
      callback={setGroup}
      label="Studieplan"
      selected={group}
      value="studieplaner"
    />
  </fieldset>
);

const CourseItem = ({ course, reportSchema }) => (
  <Text as="section">
    <dl>
      <dt>Tittel</dt>
      <dd>{course.courseTitle}</dd>
      <dt>Saksnummer</dt>
      <dd>{course.caseNumber}</dd>
      <dt>Kursperiode</dt>
      <dd>
        {course.startDate}–{course.endDate}
      </dd>
      <dt>Arrangør</dt>
      <dd>{course.organizer}</dd>
      <dt>Studieplan</dt>
      <dd>{course.curriculum}</dd>
    </dl>
    {course.reportSchema && (
      <p>
        <ExportSchema reportSchema={reportSchema} course={course} />
      </p>
    )}
  </Text>
);

function remixISODate(str: any, fullYear = false) {
  if (typeof str !== "string") return "";
  const parts = str.split("-");
  return `${parts[2]}.${parts[1]}.${
    fullYear ? parts[0] : parts[0].substring(2)
  }`;
}

function makeTitle(year, county, countyOptions) {
  const parts = [
    `Kursstatistikk ${year}`,
    (countyOptions.slice(1).find((el) => el[0] === county) || [])[1],
  ];
  return parts.filter(Boolean).join(", ");
}

const Courses: FC<CoursesProps> = ({
  county,
  countyOptions,
  counties,
  curriculums,
  group,
  items,
  organizers,
  reportSchema,
  year,
  yearOptions,
}) => {
  const router = useRouter();
  const nav = (query = {}) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    });
  };
  const setYear = (year: string) => nav({ year });
  const setCounty = (county: string) => nav({ county });
  const setGroup = (group: string) => nav({ group });
  const [organization, setOrganization] = useState(undefined);
  const [modal, setModal] = useState("");

  const tableData = useMemo(() => items, [items]);
  const columns = useMemo(() => {
    const cols = [
      {
        Header: "Lokallag",
        accessor: "organizerIndex",
        Cell: ({ value }) => organizers[value] || null,
      },
      {
        Header: "Fylke",
        accessor: "countyIndex",
        Cell: ({ value }) => counties[value] || null,
      },
      {
        Header: "Start",
        accessor: "startDate",
        Cell: ({ value }) => remixISODate(value),
      },
      {
        Header: "Slutt",
        accessor: "endDate",
        Cell: ({ value }) => remixISODate(value),
      },
      {
        Header: "Studieplan",
        accessor: "curriculumIndex",
        Cell: ({ value }) => curriculums[value] || null,
      },
      {
        Header: "Tittel",
        accessor: "courseTitle",
        Footer: (info) =>
          useMemo(() => `${info.data.length} kurs`, [info.data]),
      },
      {
        Header: "Status",
        accessor: "reportStatus",
        Cell: ({ row, value }) => {
          if (value) return value;
          if (row.isGrouped) return null;

          return "Søknad godkjent";
        },
      },
      {
        Header: "",
        accessor: "caseNumber",
        disableSortBy: true,
        Cell: ({ row, value }) => {
          if (row.isGrouped) return null;
          return (
            <button
              className="transparent tight"
              title="Vis kursinformasjon"
              onClick={() => setModal(value)}
            >
              <Info />
            </button>
          );
        },
      },
      {
        Header: "Kurs",
        accessor: () => 1,
        id: "courses",
        aggregate: "sum",
        Cell: () => null,
        Aggregated: ({ value }) => value,
        sortDescFirst: true,
        className: "num",
        Footer: (info) => useMemo(() => info.data.length, [info.data]),
      },
      {
        Header: "Timer",
        accessor: "hours",
        aggregate: "sum",
        sortDescFirst: true,
        className: "num",
        Footer: (info) =>
          useMemo(
            () => info.data.reduce((sum, row) => (+row.hours || 0) + sum, 0),
            [info.data]
          ),
      },
      {
        Header: "Deltakere",
        accessor: "participants",
        sortDescFirst: true,
        aggregate: "sum",
        className: "num",
        Footer: (info) =>
          useMemo(
            () =>
              info.data.reduce((sum, row) => (+row.participants || 0) + sum, 0),
            [info.data]
          ),
      },
    ];

    return cols;
  }, [organizers, counties, curriculums, reportSchema]);

  const groupBy = useMemo(() => {
    switch (group) {
      case "lag":
        return ["organizerIndex"];
      case "fylker":
        return ["countyIndex"];
      case "studieplaner":
        return ["curriculumIndex"];
    }
    return [];
  }, [group]);

  const sortBy = useMemo(() => {
    switch (group) {
      case "lag":
        return [{ id: "hours", desc: true }];
      case "fylker":
        return [{ id: "countyIndex" }];
      case "studieplaner":
        return [{ id: "hours", desc: true }];
    }
    return [{ id: "startDate" }];
  }, [group]);

  const getModalCourse = useCallback(() => {
    const course =
      modal && tableData.find(({ caseNumber }) => caseNumber === modal);
    if (!course) return null;
    return {
      ...course,
      startDate: remixISODate(course.startDate, true),
      endDate: remixISODate(course.endDate, true),
      organizer: organizers[course.organizerIndex],
      curriculum: curriculums[course.curriculumIndex],
    };
  }, [modal, tableData]);

  return (
    <>
      <Box as="main" variant="light" container>
        <Box my={3}>
          <Text as="h1">{makeTitle(year, county, countyOptions)}</Text>
          <Filter
            {...{
              county,
              organization,
              setCounty,
              setGroup,
              setOrganization,
              setYear,
              year,
              yearOptions,
              countyOptions,
              organizationOptions: [],
            }}
          />
          <GroupTabs group={group} setGroup={setGroup} />
          <Table
            data={tableData}
            columns={columns}
            initialState={{ groupBy, sortBy }}
            disableSortRemove
          />
          <AlertDialog
            title="Kursinformasjon"
            open={!!modal.length}
            close={() => setModal("")}
          >
            <CourseItem reportSchema={reportSchema} course={getModalCourse()} />
          </AlertDialog>
          <style jsx global>
            {`
              button.transparent {
                background: transparent;
                border: 0;
                cursor: pointer;
              }
              button.tight {
                border-radius: 50%;
                padding: 0;
                line-height: 0;
              }
              button.transparent:hover,
              button.transparent:focus {
                background: lightgray;
              }
              button.transparent:active {
                color: gray;
              }
            `}
          </style>
        </Box>
      </Box>
      <Box variant="dark" py={3}>
        <Box container>Vofo!</Box>
      </Box>
    </>
  );
};

export default Courses;
