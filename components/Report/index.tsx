import AssociationReport from "./AssociationReport";
import RegionReport from "./RegionReport";
import TotalReport from "./TotalReport";

import {
  ASSOCIATION,
  REGION,
  TOTAL,
  RegionReportProps,
  AssociationReportProps,
  TotalReportProps,
} from "../../types";

const Report = (
  props: RegionReportProps | AssociationReportProps | TotalReportProps
) => {
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
