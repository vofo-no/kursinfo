import fs from "fs";
import path from "path";

import {
  ASSOCIATION,
  AssociationReportProps,
  Dictionary,
  INamed,
  REGION,
  RegionReportProps,
  ReportProps,
  TOTAL,
  TotalReportProps,
} from "../../types";

interface ParamType {
  year: string;
  report: string;
}

interface StaticDataProps {
  props: RegionReportProps | AssociationReportProps | TotalReportProps;
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
        key?: string | string[];
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
      switch (reportData.type) {
        case ASSOCIATION: {
          if ((reportData.key as string) !== reportData.key)
            throw new Error("Unexpected association key");
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
        case TOTAL: {
          if ((reportData.key as string[]) !== reportData.key)
            throw new Error("Unexpected combo key");
          const aKeys = Object.keys(associations).filter((a) =>
            reportData.key.includes(a)
          );
          return {
            name: name,
            courses: aKeys.reduce((sum, a) => sum + associations[a].courses, 0),
            participants: aKeys.reduce(
              (sum, a) =>
                sum +
                associations[a].participants.males +
                associations[a].participants.females,
              0
            ),
            hours: aKeys.reduce((sum, a) => sum + associations[a].hours, 0),
            coursesPerCapita:
              aKeys.reduce((sum, a) => sum + associations[a].courses, 0) /
              population,
            isCurrent: false,
          };
        }
        case REGION: {
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
        }
      }
    })
    .sort((a, b) => b.coursesPerCapita - a.coursesPerCapita);

  const props = {
    year,
    type: reportData.type,
    report: reportData,
    municipalities: data.municipalities,
    counties,
    municipalityNames: Object.keys(data.municipalities).reduce((obj, key) => {
      obj[key] = data.municipalities[key].name;
      return obj;
    }, {}),
  };

  if (reportData.type === ASSOCIATION) {
    props["orgNames"] = getOrgNames(reportData.key as string);
  }

  return {
    props,
  };
};

export default getReportStaticData;
