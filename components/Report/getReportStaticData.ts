import fs from "fs";
import path from "path";

import {
  RegionReportProps,
  AssociationReportProps,
  ReportProps,
  ASSOCIATION,
  INamed,
  Dictionary,
} from "../../types";

interface ParamType {
  year: string;
  report: string;
}

interface StaticDataProps {
  props: RegionReportProps | AssociationReportProps;
}

const getOrgNames = (sf: string): Dictionary<INamed> => {
  const namePath = path.join(process.cwd(), `data/names/orgs/${sf}.json`);

  if (!fs.existsSync(namePath)) return {};

  return JSON.parse(fs.readFileSync(namePath, "utf-8"));
};

export const getReportStaticData = async ({
  year,
  report,
}: ParamType): Promise<StaticDataProps> => {
  const dataPath = path.join(process.cwd(), `data/${year}.json`);
  const data: {
    reports: {
      [key: string]: ReportProps["report"] & {
        type: ReportProps["type"];
        key?: string;
      };
    };
    regions: string[];
    municipalities: ReportProps["municipalities"];
  } = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const reportData = data.reports[report];

  const counties: ReportProps["counties"] = data.regions
    .filter((key) => !data.reports[key].isFuture)
    .map((key) => {
      const {
        name,
        courses,
        participants,
        hours,
        associations,
        population,
        municipalities = [],
      } = data.reports[key];
      if (reportData.type === ASSOCIATION) {
        const association = associations[reportData.key];
        return {
          name: name,
          courses: association.courses,
          participants:
            association.participants.males + association.participants.females,
          hours: association.hours,
          coursesPerCapita: association.courses / population,
          isCurrent: false,
        };
      }
      return {
        name: name,
        courses: courses,
        participants: participants.males + participants.females,
        hours: hours,
        coursesPerCapita: courses / population,
        isCurrent: municipalities.every((m) =>
          reportData.municipalities.includes(m)
        ),
      };
    })
    .sort((a, b) => b.coursesPerCapita - a.coursesPerCapita);

  const props = {
    year,
    type: reportData.type,
    report: reportData,
    municipalities: data.municipalities,
    counties,
  };

  if (reportData.type === ASSOCIATION) {
    props["orgNames"] = getOrgNames(reportData.key);
  }

  return {
    props,
  };
};

export default getReportStaticData;
