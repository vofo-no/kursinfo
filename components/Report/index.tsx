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

const components = {
  [ASSOCIATION]: AssociationReport,
  [REGION]: RegionReport,
  [TOTAL]: TotalReport,
};

const Report = (
  props: RegionReportProps | AssociationReportProps | TotalReportProps
) => {
  const ReportComponent = components[props.type];
  return <ReportComponent {...props} />;
};

export default Report;
