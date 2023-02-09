import AlertDialog from "components/AlertDialog";
import { useRouter } from "next/router";
import React, { Dispatch, ReactElement, useMemo, useState } from "react";
import { Info } from "react-feather";
import { FormattedNumber } from "react-intl";
import { CellProps, Column, HeaderProps } from "react-table";
import { CourseStatus, IndexedCourseItem } from "types/courses";

import { CoursesProps, ExtendedICourseItem } from "./constants";
import getUrlObject from "./helpers/getUrlObject";
import remixISODate from "./helpers/remixISODate";
import Item from "./Item";
import Table from "./Table";

const PlannedNum = ({
  value,
  prefix = "(",
}: {
  value: number;
  prefix?: string;
}): JSX.Element => (
  <>
    <span>
      <FormattedNumber value={Number(value)} maximumFractionDigits={0} />
    </span>
    <style jsx>{`
      span:before {
        content: "${prefix}";
      }
      span:after {
        content: ")";
        position: absolute;
      }
    `}</style>
  </>
);

interface NumCellProps
  extends Pick<CellProps<IndexedCourseItem>, "value" | "row"> {
  status?: CourseStatus;
}
interface AggNumHeaderProps
  extends Pick<HeaderProps<IndexedCourseItem>, "groupedRows" | "column"> {
  status?: CourseStatus;
}
interface IStatusProps {
  status?: CourseStatus;
}

const withStatus = <P extends IStatusProps>(
  WrappedComponent: React.FunctionComponent<P>,
  status: CourseStatus
): ((props: P) => JSX.Element) => {
  const WithStatus = (props: P) => (
    <WrappedComponent {...props} status={status} />
  );
  return WithStatus;
};

const NumCell = ({ value, row, status }: NumCellProps) => {
  if (typeof value !== "number") return null;
  return (status || (row && row.original && row.original.status)) ===
    CourseStatus.PLANNED ? (
    <PlannedNum value={value} />
  ) : (
    <FormattedNumber value={value} maximumFractionDigits={0} />
  );
};

const AggNumFooter = ({ groupedRows, column, status }: AggNumHeaderProps) => {
  const outVal = groupedRows.reduce((sum, row) => {
    const val = row.values[column.id];
    return typeof val === "number" ? val + sum : sum;
  }, 0);
  return status === CourseStatus.PLANNED ? (
    <PlannedNum value={outVal} />
  ) : (
    <FormattedNumber value={outVal} maximumFractionDigits={0} />
  );
};

const numCol = (
  Header: string,
  accessor: keyof IndexedCourseItem
): Column<IndexedCourseItem> => ({
  Header,
  accessor,
  aggregate: "sum",
  sortDescFirst: true,
  className: "num",
  // @ts-ignore
  Footer: (p: HeaderProps<IndexedCourseItem>) => {
    return p.rows
      .reduce(
        ([dd, space, pp], r) => {
          const val = r.values[accessor];
          if (typeof val === "number") {
            if (r.values["status"] === CourseStatus.PLANNED)
              return [dd, space, Number(pp) + val];
            return [Number(dd) + val, space, pp];
          }
          return [dd, space, pp];
        },
        [0, " ", 0]
      )
      .map((v, i) => {
        switch (i) {
          default:
            return (
              v && (
                <FormattedNumber
                  key={`${p.column.id}-foot-done`}
                  value={Number(v)}
                  maximumFractionDigits={0}
                />
              )
            );
          case 1:
            return v;
          case 2:
            return (
              v && (
                <PlannedNum
                  key={`${p.column.id}-foot-planned`}
                  prefix="(+"
                  value={Number(v)}
                />
              )
            );
        }
      })
      .filter(Boolean);
  },
  Cell: NumCell,
});

const aggCol = (
  Header: string,
  accessor: keyof IndexedCourseItem,
  status: CourseStatus
): Column<IndexedCourseItem> => ({
  Header,
  id: `agg-${accessor}-${status.toString()}`,
  accessor: (row: IndexedCourseItem) =>
    row.status === status ? (accessor === "ID" ? 1 : row[accessor]) : undefined,
  aggregate: "sum",
  sortDescFirst: true,
  className: `num ${
    status === CourseStatus.PLANNED ? "status-planned" : "status-done"
  }`,
  Footer: withStatus<AggNumHeaderProps>(AggNumFooter, status),
  Cell: withStatus<NumCellProps>(NumCell, status),
});

function FuncCell(props: CellProps<IndexedCourseItem>): ReactElement {
  const { value, row, column } = props;
  if (
    (typeof value === "string" || typeof value === "number") &&
    column?.makeValue
  )
    return <>{column.makeValue(value)}</>;
  if (row.isGrouped) return <></>;
  return <>(Ukjent)</>;
}

const DateCell = ({ value }: { value?: string }) => <>{remixISODate(value)}</>;

const statusText: Record<CourseStatus, string> = {
  [CourseStatus.PLANNED]: "Planlagt",
  [CourseStatus.DONE]: "Gjennomført",
};

const getMoreInfoCell = (callback: Dispatch<string>) => {
  const MoreInfoCell = ({ value }: { value?: string }) =>
    value ? (
      <button
        className="transparent tight"
        title="Vis kursinformasjon"
        onClick={() => callback(value)}
      >
        <Info />
      </button>
    ) : null;
  return MoreInfoCell;
};

const CoursesTable = ({
  counties,
  county,
  countyParams,
  curriculums,
  group,
  items,
  organization,
  organizations,
  organizers,
  reportSchema,
  useTitleColumn,
}: Pick<
  CoursesProps,
  | "counties"
  | "county"
  | "countyParams"
  | "curriculums"
  | "group"
  | "items"
  | "organization"
  | "organizations"
  | "organizers"
  | "reportSchema"
  | "useTitleColumn"
>): JSX.Element => {
  const tableData = useMemo(() => items, [items]);
  const [modal, setModal] = useState("");
  const router = useRouter();
  const { pathname, query } = router;

  const groupBy = useMemo(() => {
    switch (group) {
      case "organisasjoner":
        return ["organizationCode"];
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
        return [{ id: "agg-hours-7", desc: true }];
      case "fylker":
        return [{ id: "countyIndex" }];
    }
    return [{ id: "startDate" }];
  }, [group]);

  const modalCourse: ExtendedICourseItem | undefined = useMemo(() => {
    const course = modal && tableData.find(({ ID }) => ID === modal);
    if (!course) return undefined;
    return {
      ...course,
      startDate: remixISODate(course.startDate, true) || "",
      endDate: remixISODate(course.endDate, true) || undefined,
      organizer: organizers[course.organizerIndex],
      curriculum: curriculums[course.curriculumIndex],
    };
  }, [curriculums, modal, organizers, tableData]);

  const columns: Array<Column<IndexedCourseItem>> = useMemo(() => {
    const base: Array<Column<IndexedCourseItem>> = [
      {
        Header: "Organisasjon",
        accessor: "organizationCode",
        Cell: FuncCell,
        makeValue: (param) =>
          (typeof param === "string" && organizations[Number(param)]) ||
          "(Ukjent)",
        makeHref: (param: string) =>
          getUrlObject(
            pathname,
            query,
            { organization: param },
            { group, organization, county }
          ),
      },
      {
        Header: "Lokallag",
        accessor: "organizerIndex",
        Cell: FuncCell,
        makeValue: (param) =>
          (typeof param === "number" && organizers[param]) || "(Ukjent)",
      },
      {
        Header: "Fylke",
        accessor: "countyIndex",
        Cell: FuncCell,
        makeValue: (param) =>
          (typeof param === "number" && counties[param]) || "(Ukjent)",
        makeHref: (param: string) =>
          getUrlObject(
            pathname,
            query,
            { county: countyParams[Number(param)] },
            { group, organization, county }
          ),
      },
      {
        Header: "Start",
        accessor: "startDate",
        Cell: DateCell,
      },
      {
        Header: "Slutt",
        accessor: "endDate",
        Cell: DateCell,
      },
      {
        Header: "Studieplan",
        accessor: "curriculumIndex",
        Cell: FuncCell,
        makeValue: (param) =>
          (typeof param === "number" && curriculums[param]) || "(Ukjent)",
      },
      { Header: "Tittel", accessor: "title" },
      {
        Header: "Status",
        accessor: "status",
        Cell: FuncCell,
        makeValue: (value?: IndexedCourseItem["status"]) =>
          (value && statusText[value]) || null,
      },
      {
        Header: "",
        accessor: "ID",
        disableSortBy: true,
        Cell: getMoreInfoCell(setModal),
      },
    ];

    const filteredBase = base.filter(
      (item) => useTitleColumn || item.Header !== "Tittel"
    );

    const aggColumns: Array<Column<IndexedCourseItem>> = [
      {
        Header: "Gjennomførte",
        columns: [
          aggCol("Kurs", "ID", CourseStatus.DONE),
          aggCol("Timer", "hours", CourseStatus.DONE),
          aggCol("Deltakere", "participants", CourseStatus.DONE),
          aggCol("Tilskudd", "grant", CourseStatus.DONE),
        ],
        Footer: () => null,
      },
      {
        Header: "+ Planlagte",
        columns: [
          aggCol("Kurs", "ID", CourseStatus.PLANNED),
          aggCol("Timer", "hours", CourseStatus.PLANNED),
        ],
        Footer: () => null,
      },
    ];
    const allCoursesColumns: Array<Column<IndexedCourseItem>> = [
      numCol("Timer", "hours"),
      numCol("Deltakere", "participants"),
      numCol("Tilskudd", "grant"),
    ];

    if (group === "kurs") return [...filteredBase, ...allCoursesColumns];

    return [...filteredBase, ...aggColumns];
  }, [
    group,
    organizations,
    pathname,
    query,
    organization,
    county,
    organizers,
    counties,
    countyParams,
    curriculums,
    useTitleColumn,
  ]);

  const hiddenColumns = useMemo(() => {
    if (!groupBy.length)
      return useTitleColumn
        ? ["organizationCode", "countyIndex", "curriculumIndex"]
        : ["organizationCode", "countyIndex", "title"];
    const cols: Array<keyof IndexedCourseItem> = [
      "title",
      "curriculumIndex",
      "organizationCode",
      "organizerIndex",
      "countyIndex",
      "startDate",
      "endDate",
      "status",
      "ID",
    ];
    return cols.filter((c) => !groupBy.includes(c));
  }, [groupBy, useTitleColumn]);

  return (
    <>
      <Table
        data={tableData}
        columns={columns}
        initialState={{
          groupBy,
          sortBy,
          hiddenColumns,
          pageSize: 100,
        }}
        disableSortRemove
      />
      <AlertDialog
        title="Kursinformasjon"
        open={!!modal.length}
        close={() => setModal("")}
      >
        <Item reportSchema={reportSchema} course={modalCourse} />
      </AlertDialog>
    </>
  );
};

export default CoursesTable;
