import "@tanstack/react-table";

import { CoursesParams } from "types/courses";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    getUrlParams?: (param: any) => Partial<CoursesParams>;
    getPlainValue?: (props: CellContext<TData>) => unknown;
    className?: string;
    isNumeric?: boolean;
    isPlanned?: boolean;
    isDone?: boolean;
  }
}
