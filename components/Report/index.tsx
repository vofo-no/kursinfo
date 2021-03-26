import { FC } from "react";

import {
  ASSOCIATION,
  AssociationReportProps,
  REGION,
  RegionReportProps,
  TOTAL,
  TotalReportProps,
} from "../../types";
import AssociationReport from "./AssociationReport";
import RegionReport from "./RegionReport";
import TotalReport from "./TotalReport";

const Report: FC<
  RegionReportProps | AssociationReportProps | TotalReportProps
> = (props) => {
  switch (props.type) {
    case ASSOCIATION:
      return <AssociationReport {...(props as AssociationReportProps)} />;
    case REGION:
      return <RegionReport {...(props as RegionReportProps)} />;
    case TOTAL:
      return <TotalReport {...(props as TotalReportProps)} />;
  }
};

export default Report;
