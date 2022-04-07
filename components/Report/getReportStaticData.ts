import associationNames from "data/names/associations.json";
import fs from "fs";
import { GetStaticPropsResult } from "next";
import path from "path";
import {
  ASSOCIATION,
  AssociationReportProps,
  COMBO,
  ComboReportProps,
  GLOBAL,
  GlobalReportProps,
  IDataFile,
  INamed,
  Participants,
  REGION,
  RegionReportProps,
  ReportParams,
} from "types/reports";

import getCountiesFromData from "./helpers/getCountiesFromData";
import getMunicipalitiesFromData from "./helpers/getMunicipalitiesFromData";
import getNamedOrganizationsFromData from "./helpers/getNamedOrganizationsFromData";
import getTopSubjectsFromData from "./helpers/getTopSubjectsFromData";

type AssociationNameKey = keyof typeof associationNames;

function getAssociationName(key: string): INamed {
  if (!(key in associationNames)) return { name: key };
  return associationNames[key as AssociationNameKey];
}

function recordToArray<T>(
  records: Record<string, T>
): Array<T & { key: string }> {
  return Object.keys(records).map((key) => ({ ...records[key], key }));
}

export const getReportStaticData = async ({
  year,
  report,
}: ReportParams): Promise<
  GetStaticPropsResult<
    | RegionReportProps
    | AssociationReportProps
    | ComboReportProps
    | GlobalReportProps
  >
> => {
  const dataPath = path.join(process.cwd(), `data/${year}.json`);
  const data: IDataFile = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const reportData = data.reports[report];

  const { name, historical } = reportData;

  const counties = getCountiesFromData(data.reports, data.regions, report);

  const municipalityKeys =
    "municipalities" in reportData
      ? reportData.municipalities
      : Object.keys(data.municipalities);
  const municipalities = getMunicipalitiesFromData(
    data.municipalities,
    municipalityKeys,
    reportData.municipalityValues
  );

  const topSubjects = getTopSubjectsFromData(
    reportData.subjects,
    reportData.topSubjects
  );

  const associations = recordToArray(reportData.associations)
    .sort((a, b) => b.hours - a.hours)
    .filter((item) => item.courses);

  const psum = (p: Participants) => p.females + p.males;
  const mainSubjects = recordToArray(reportData.mainSubjects)
    .sort((a, b) => psum(b.participants) - psum(a.participants))
    .filter((item) => psum(item.participants));

  const baseProps = {
    year,
    name,
    municipalities,
    counties,
    historical,
    mainSubjects,
    topSubjects,
    ageSetHistory: reportData.participants.ages,
    summary: {
      courses: reportData.courses,
      facilitatedCourses: reportData.facilitated.courses,
      participants:
        reportData.participants.males + reportData.participants.females,
      hours: reportData.hours,
      organizations: reportData.organizations,
      activeMunicipalitiesLength: Object.keys(reportData.municipalityValues)
        .length,
      allMunicipalitiesLength: municipalityKeys.length,
    },
    participantsHistogram: reportData.participantsHistogram || null,
    participantsHistogramSums: reportData.participantsHistogramSums || null,
  };

  switch (reportData.type) {
    case REGION: {
      const props: RegionReportProps = {
        ...baseProps,
        type: reportData.type,
        associations: associations.map((item) => ({
          ...item,
          ...getAssociationName(item.key),
        })),
        historicalAll: reportData.historicalAll,
      };
      return { props };
    }
    case ASSOCIATION: {
      const props: AssociationReportProps = {
        ...baseProps,
        type: reportData.type,
        organizations: getNamedOrganizationsFromData(
          reportData.key,
          associations
        ),
        historicalAll: reportData.historicalAll,
      };
      return { props };
    }
    case COMBO: {
      const props: ComboReportProps = {
        ...baseProps,
        type: reportData.type,
        associations: associations.map((item) => ({
          ...item,
          ...getAssociationName(item.key),
        })),
        historicalAll: reportData.historicalAll,
      };
      return { props };
    }
    case GLOBAL: {
      const props: GlobalReportProps = {
        ...baseProps,
        type: reportData.type,
        associations: associations.map((item) => ({
          ...item,
          ...getAssociationName(item.key),
        })),
      };
      return { props };
    }
  }
};

export default getReportStaticData;
