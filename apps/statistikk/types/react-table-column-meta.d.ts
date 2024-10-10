import "@tanstack/react-table";

import { CoursesParams } from "@/types/courses";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData> {
    getUrlParams?: (param: unknown) => Partial<CoursesParams>;
    getPlainValue?: (props: CellContext<TData>) => unknown;
    className?: string;
    isNumeric?: boolean;
    isPlanned?: boolean;
    isDone?: boolean;
  }
}
