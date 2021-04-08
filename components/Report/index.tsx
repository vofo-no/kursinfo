import { FC } from "react";
import {
  ASSOCIATION,
  AssociationReportProps,
  COMBO,
  ComboReportProps,
  GLOBAL,
  GlobalReportProps,
  REGION,
  RegionReportProps,
} from "types/reports";

import AssociationReport from "./AssociationReport";
import ComboReport from "./ComboReport";
import GlobalReport from "./GlobalReport";
import RegionReport from "./RegionReport";

const Report: FC<
  | RegionReportProps
  | AssociationReportProps
  | ComboReportProps
  | GlobalReportProps
> = (props) => {
  switch (props.type) {
    case ASSOCIATION:
      return <AssociationReport {...props} />;
    case COMBO:
      return <ComboReport {...props} />;
    case GLOBAL:
      return <GlobalReport {...props} />;
    case REGION:
      return <RegionReport {...props} />;
  }
};

export default Report;
