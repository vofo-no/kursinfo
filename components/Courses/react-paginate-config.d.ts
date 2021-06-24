import { ReactPaginateProps as oProps } from "react-paginate";

declare module "react-paginate" {
  export interface ReactPaginateProps extends oProps {
    nextAriaLabel?: string;
    previousAriaLabel?: string;
  }
}
