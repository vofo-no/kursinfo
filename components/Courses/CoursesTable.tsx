import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/nb";

import AlertDialog from "components/AlertDialog";
import { useRouter } from "next/router";
import { Dispatch, FC, useMemo, useState } from "react";
import { Info } from "react-feather";
import { Cell, Column, HeaderProps } from "react-table";
import { CourseStatus, IndexedCourseItem } from "types/courses";

import { CoursesProps, ExtendedICourseItem } from "./constants";
import getUrlObject from "./helpers/getUrlObject";
import remixISODate from "./helpers/remixISODate";
import Item from "./Item";
import Table from "./Table";

const numCol = (
  Header: string,
  accessor: keyof IndexedCourseItem
): Column<IndexedCourseItem> => ({
  Header,
  accessor,
  aggregate: "sum",
  sortDescFirst: true,
  className: "num",
  Footer: (p: HeaderProps<IndexedCourseItem>) => {
    return p.rows
      .reduce(
        ([dd, pp], r) => {
          const val = r.values[accessor];
          if (typeof val === "number") {
            if (r.values["status"] === CourseStatus.PLANNED)
              return [dd, pp + val];
            return [dd + val, pp];
          }
          return [dd, pp];
        },
        [0, 0]
      )
      .map((v, i) =>
        i === 1 && v
          ? `(+${v.toLocaleString("nb")})`
          : v && v.toLocaleString("nb")
      )
      .filter(Boolean)
      .join(" ");
  },
  Cell: (p: Cell<IndexedCourseItem>) => {
    if (!p.row.original || typeof p.value !== "number") return null;
    const out = p.value.toLocaleString("nb");
    return p.row.original.status === CourseStatus.PLANNED ? `(${out})` : out;
  },
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
  Footer: (p: HeaderProps<IndexedCourseItem>) => {
    const out = p.groupedRows
      .reduce((sum, row) => {
        const val = row.values[p.column.id];
        return typeof val === "number" ? val + sum : sum;
      }, 0)
      .toLocaleString("nb");
    return status === CourseStatus.PLANNED ? `(${out})` : out;
  },
  Cell: (p: { value?: number } = {}) => {
    if (!p || typeof p.value !== "number") return null;
    const out = p.value.toLocaleString("nb");
    return status === CourseStatus.PLANNED ? `(${out})` : out;
  },
});

const getNamedIndexCell = (dict: Array<string>) => {
  const NamedIndexCell = ({ value }: { value?: number | string | null }) => {
    if (typeof value === "string" || typeof value === "number") {
      return dict[Number(value)];
    }
    return "(Ukjent)";
  };
  return NamedIndexCell;
};

const DateCell = ({ value }: { value?: string }) => remixISODate(value);

const statusText: Record<CourseStatus, string> = {
  [CourseStatus.PLANNED]: "Planlagt",
  [CourseStatus.DONE]: "Gjennomført",
};
const StatusCell = ({ value }: { value?: IndexedCourseItem["status"] }) =>
  value ? statusText[value] : null;

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

const CoursesTable: FC<
  Pick<
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
  >
> = ({
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
}) => {
  const tableData = useMemo(() => items, [items]);
  const [modal, setModal] = useState("");
  const router = useRouter();

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
  }, [modal, tableData]);

  const columns: Array<Column<IndexedCourseItem>> = useMemo(() => {
    const base: Array<Column<IndexedCourseItem>> = [
      {
        Header: "Organisasjon",
        accessor: "organizationCode",
        Cell: getNamedIndexCell(organizations),
        makeHref: (param: string) =>
          getUrlObject(
            router,
            { organization: param },
            { group, organization, county }
          ),
      },
      {
        Header: "Lokallag",
        accessor: "organizerIndex",
        Cell: getNamedIndexCell(organizers),
      },
      {
        Header: "Fylke",
        accessor: "countyIndex",
        Cell: getNamedIndexCell(counties),
        makeHref: (param: string) =>
          getUrlObject(
            router,
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
        Cell: getNamedIndexCell(curriculums),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusCell,
      },
      {
        Header: "",
        accessor: "ID",
        disableSortBy: true,
        Cell: getMoreInfoCell(setModal),
      },
    ];
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

    if (group === "kurs") return [...base, ...allCoursesColumns];

    return [...base, ...aggColumns];
  }, [tableData, group]);

  const hiddenColumns = useMemo(() => {
    if (!groupBy.length) return ["organizationCode", "countyIndex"];
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
  }, [groupBy]);

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
