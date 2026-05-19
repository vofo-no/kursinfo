import "@tanstack/react-table";

import { StudieforbundParams } from "@/app/(studieforbund)/types";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData> {
    getUrlParams?: (param: unknown) => Partial<StudieforbundParams>;
    getPlainValue?: (props: CellContext<TData>) => unknown;
    className?: string;
    isNumeric?: boolean;
    isPlanned?: boolean;
    isDone?: boolean;
  }
}
