import AssociationReport from "./AssociationReport";
import RegionReport from "./RegionReport";

import {
  ASSOCIATION,
  REGION,
  RegionReportProps,
  AssociationReportProps,
} from "../../types";

const components = {
  [ASSOCIATION]: AssociationReport,
  [REGION]: RegionReport,
};

const Report = (props: RegionReportProps | AssociationReportProps) => {
  const ReportComponent = components[props.type];
  return <ReportComponent {...props} />;
};

export default Report;
