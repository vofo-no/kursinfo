import { Box, Text } from "@vofo-no/design";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";
import { Info } from "react-feather";

import { CoursesParams } from "../../types/courses";
import AlertDialog from "../AlertDialog";
import Table from "../Table";
import {
  CoursesProps,
  GroupType,
  isDefaultCounty,
  isDefaultOrganization,
} from "./constants";
import Filter from "./Filter";
import GroupTabs from "./GroupTabs";
import Item from "./Item";

function remixISODate(str: unknown, fullYear = false) {
  if (typeof str !== "string") return "";
  const parts = str.split("-");
  return `${parts[2]}.${parts[1]}.${
    fullYear ? parts[0] : parts[0].substring(2)
  }`;
}

function makeTitle(
  year: string,
  county: string,
  countyOptions: Array<Array<string>>
) {
  const parts = [
    `Kursstatistikk ${year}`,
    (countyOptions.slice(1).find((el) => el[0] === county) || [])[1],
  ];
  return parts.filter(Boolean).join(", ");
}

interface NumberCell {
  value: number;
}

interface StringCell {
  value: string;
}

interface StatusCell {
  value?: string;
  row: { isGrouped: boolean };
}

interface InfoCell {
  data: Array<{ hours?: number; participants?: number }>;
}

const Courses: FC<CoursesProps> = ({
  county,
  countyOptions,
  counties,
  curriculums,
  group,
  items,
  organization,
  organizationOptions,
  organizers,
  reportSchema,
  year,
  yearOptions,
  ...rest
}) => {
  const router = useRouter();
  const nav = (query: Partial<CoursesParams> = {}) => {
    if (!query.group) {
      if (
        query.county &&
        !isDefaultCounty(query.county) &&
        group === "fylker"
      ) {
        query.group = !isDefaultOrganization(query.organization || organization)
          ? "lag"
          : "organisasjoner";
      }
      if (
        query.organization &&
        !isDefaultOrganization(query.organization) &&
        group === "organisasjoner"
      ) {
        query.group = !isDefaultCounty(query.county || county)
          ? "lag"
          : "fylker";
      }
    }
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query },
    });
  };
  const setYear = (year: string) => nav({ year });
  const setCounty = (county: string) => nav({ county });
  const setGroup = (group: GroupType) => nav({ group });
  const setOrganization = (organization: string) => nav({ organization });
  const [modal, setModal] = useState("");

  const tableData = useMemo(() => items, [items]);
  const columns = useMemo(() => {
    const cols = [
      {
        Header: "Organisasjon",
        accessor: "organizationIndex",
        Cell: ({ value }: NumberCell) => organizers[value] || null,
      },
      {
        Header: "Lokallag",
        accessor: "organizerIndex",
        Cell: ({ value }: NumberCell) => organizers[value] || null,
      },
      {
        Header: "Fylke",
        accessor: "countyIndex",
        Cell: ({ value }: NumberCell) => counties[value] || null,
      },
      {
        Header: "Start",
        accessor: "startDate",
        Cell: ({ value }: StringCell) => remixISODate(value),
      },
      {
        Header: "Slutt",
        accessor: "endDate",
        Cell: ({ value }: StringCell) => remixISODate(value),
      },
      {
        Header: "Studieplan",
        accessor: "curriculumIndex",
        Cell: ({ value }: NumberCell) => curriculums[value] || null,
      },
      {
        Header: "Tittel",
        accessor: "courseTitle",
        Footer: (info: InfoCell) =>
          useMemo(() => `${info.data.length} kurs`, [info.data]),
      },
      {
        Header: "Status",
        accessor: "reportStatus",
        Cell: ({ row, value }: StatusCell) => {
          if (value) return value;
          if (row.isGrouped) return null;

          return "Søknad godkjent";
        },
      },
      {
        Header: "",
        accessor: "caseNumber",
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Cell: ({ row, value }: StatusCell) => {
          if (row.isGrouped || !value) return null;
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
        Aggregated: ({ value }: NumberCell) => value,
        sortDescFirst: true,
        className: "num",
        Footer: (info: InfoCell) =>
          useMemo(() => info.data.length, [info.data]),
      },
      {
        Header: "Timer",
        accessor: "hours",
        aggregate: "sum",
        sortDescFirst: true,
        className: "num",
        Footer: (info: InfoCell) =>
          useMemo(
            () =>
              info.data.reduce((sum, row) => (Number(row.hours) || 0) + sum, 0),
            [info.data]
          ),
      },
      {
        Header: "Deltakere",
        accessor: "participants",
        sortDescFirst: true,
        aggregate: "sum",
        className: "num",
        Footer: (info: InfoCell) =>
          useMemo(
            () =>
              info.data.reduce(
                (sum, row) => (Number(row.participants) || 0) + sum,
                0
              ),
            [info.data]
          ),
      },
    ];

    return cols;
  }, [organizers, counties, curriculums, reportSchema]);

  const groupBy = useMemo(() => {
    switch (group) {
      case "organisasjoner":
        return ["organizationIndex"];
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
      case "studieplaner":
      case "organisasjoner":
        return [{ id: "hours", desc: true }];
      case "fylker":
        return [{ id: "countyIndex" }];
    }
    return [{ id: "startDate" }];
  }, [group]);

  const getModalCourse = useCallback(() => {
    const course =
      modal && tableData.find(({ caseNumber }) => caseNumber === modal);
    if (!course) return undefined;
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
              countyOptions,
              organization,
              organizationOptions,
              setCounty,
              setOrganization,
              setYear,
              year,
              yearOptions,
            }}
          />
          <GroupTabs
            group={group}
            setGroup={setGroup}
            county={county}
            organization={organization}
          >
            <Table
              data={tableData}
              columns={columns}
              initialState={{ groupBy, sortBy }}
              disableSortRemove
            />
          </GroupTabs>
          <AlertDialog
            title="Kursinformasjon"
            open={!!modal.length}
            close={() => setModal("")}
          >
            <Item reportSchema={reportSchema} course={getModalCourse()} />
          </AlertDialog>
          {group === "organisasjoner" && JSON.stringify(rest.tabular)}
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
