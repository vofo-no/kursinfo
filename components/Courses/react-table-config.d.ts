import {
  HeaderProps,
  Renderer,
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from "react-table";
import { UrlObject } from "url";

declare module "react-table" {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseExpandedOptions<D>,
      UseGroupByOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D>,
      Record<string, unknown> {}

  export interface Hooks<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D>,
      UsePaginationInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseGroupByState<D>,
      UseRowStateState<D>,
      UseSortByState<D>,
      UsePaginationState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseGroupByColumnOptions<D>,
      UseSortByColumnOptions<D> {
    className?: string;
    Footer?: Renderer<HeaderProps<D>>;
    makeHref?: (param: string) => UrlObject;
  }

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseGroupByColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export interface Row<
    D extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowStateRowProps<D> {}
}
