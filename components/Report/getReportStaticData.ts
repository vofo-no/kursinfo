import fs from "fs";
import { GetStaticPropsResult } from "next";
import path from "path";
import {
  ASSOCIATION,
  AssociationReportProps,
  Dictionary,
  INamed,
  REGION,
  ReportProps,
  TOTAL,
} from "types";
import { ReportDataProps, ReportParams } from "types/reports";

const perCapita = (courses: number, population = 0) => {
  if (population > 0) return courses / population;
  return 0;
};

const getOrgNames = (sf: string): Dictionary<INamed> => {
  const namePath = path.join(process.cwd(), `data/names/orgs/${sf}.json`);

  if (!fs.existsSync(namePath)) return {};

  return JSON.parse(fs.readFileSync(namePath, "utf-8"));
};

export const getReportStaticData = async ({
  year,
  report,
}: ReportParams): Promise<GetStaticPropsResult<ReportDataProps>> => {
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
            coursesPerCapita: perCapita(association.courses, population),
            isCurrent: false,
          };
        }
        case TOTAL: {
          const comboKey = reportData.key;
          if (!Array.isArray(comboKey)) throw new Error("Unexpected combo key");

          const aKeys = Object.keys(associations).filter((a) =>
            comboKey.includes(a)
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
            coursesPerCapita: perCapita(
              aKeys.reduce((sum, a) => sum + associations[a].courses, 0),
              population
            ),
            isCurrent: false,
          };
        }
        case REGION: {
          return {
            name: name,
            courses: courses,
            participants: participants.males + participants.females,
            hours: hours,
            coursesPerCapita: perCapita(courses, population),
            isCurrent: municipalities.every((m) =>
              reportData.municipalities?.includes(m)
            ),
          };
        }
      }
    })
    .sort((a, b) => Number(b.coursesPerCapita) - Number(a.coursesPerCapita));

  const props = {
    year,
    type: reportData.type,
    report: reportData,
    municipalities: data.municipalities,
    counties,
    municipalityNames: Object.keys(data.municipalities).reduce(
      (obj: Record<string, string>, key) => {
        obj[key] = data.municipalities[key].name;
        return obj;
      },
      {}
    ),
  };

  if (reportData.type === ASSOCIATION) {
    (props as AssociationReportProps).orgNames = getOrgNames(
      reportData.key as string
    );
  }

  return {
    props,
  };
};

export default getReportStaticData;
