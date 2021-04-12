export const ASSOCIATION = "ASSOCIATION";
export const REGION = "REGION";
export const COMBO = "COMBO";
export const GLOBAL = "GLOBAL";

import { ParsedUrlQuery } from "node:querystring";

export interface ReportParams extends ParsedUrlQuery {
  year: string;
  report: string;
}

export interface IDataFile {
  municipalities: { [key: string]: Municipality };
  reports: {
    [key: string]:
      | IRegionReport
      | IAssociationReport
      | IGlobalReport
      | IComboReport;
  };
  regions: string[];
  associations: string[];
}

export interface Municipality {
  name: string;
  pop: number;
}

export type AnyReportType =
  | typeof ASSOCIATION
  | typeof COMBO
  | typeof GLOBAL
  | typeof REGION;

export interface IReportBase {
  name: string;
  courses: number;
  facilitated: Facilitated;
  hours: number;
  historical: Historical;
  participants: ParticipantsWithAgeSetHistory;
  municipalityValues: Record<string, CompactValues>;
  organizations: number;
  associations: Record<string, Association>;
  subjects: Record<string, Subject>;
  topSubjects: AgeSet<Array<string>>;
  mainSubjects: Record<string, MainSubject>;
}

export interface IRegionReport extends IReportBase {
  type: typeof REGION;
  key: string;
  isFuture: boolean;
  municipalities: string[];
  population: number;
  historicalAll: Historical;
}

export interface IAssociationReport extends IReportBase {
  type: typeof ASSOCIATION;
  key: string;
  historicalAll: Historical;
}

export interface IGlobalReport extends IReportBase {
  type: typeof GLOBAL;
  key: string;
}

export interface IComboReport extends IReportBase {
  type: typeof COMBO;
  keys: string[];
  historicalAll: Historical;
}

export interface Association {
  courses: number;
  participants: Participants;
  hours: number;
  lastYearHours: number;
  facilitated: Facilitated;
}

export interface Facilitated {
  courses: number;
  hours: number;
  participants: Participants;
}

export interface Participants {
  males: number;
  females: number;
}

export interface ParticipantsWithAgeSetHistory extends Participants {
  ages: Array<AgeSet<number>>;
}

export interface ParticipantsWithAgeSet extends Participants {
  ages: AgeSet<number>;
}

export interface Historical {
  courses: number[];
  hours: number[];
  participants: number[];
}

export interface MainSubject {
  participants: Participants;
}

export interface Subject {
  participants: ParticipantsWithAgeSet;
}

export type AgeSet<T> = [T, T, T, T, T, T];

export interface ReportMunicipality {
  name: string;
  values: CompactValues;
}

export interface SummaryProps {
  courses: number;
  facilitatedCourses: number;
  participants: number;
  hours: number;
  organizations: number;
  activeMunicipalitiesLength: number;
  allMunicipalitiesLength: number;
}

export interface Organization extends Association, INamed {
  key: string;
}

export interface MainSubjectWithKey extends MainSubject {
  key: string;
}

export interface ReportPropsBase {
  name: string;
  year: string;
  counties: Array<Counties>;
  historical: Historical;
  mainSubjects: Array<MainSubjectWithKey>;
  topSubjects: AgeSet<Array<{ key: string; value: number }>>;
  ageSetHistory: Array<AgeSet<number>>;
  municipalities: Array<ReportMunicipality>;
  summary: SummaryProps;
}

export interface RegionReportProps extends ReportPropsBase {
  type: typeof REGION;
  historicalAll: Historical;
  associations: Array<Organization>;
}
export interface AssociationReportProps extends ReportPropsBase {
  type: typeof ASSOCIATION;
  historicalAll: Historical;
  organizations: Array<Organization>;
}
export interface ComboReportProps extends ReportPropsBase {
  type: typeof COMBO;
  historicalAll: Historical;
  associations: Array<Organization>;
}
export interface GlobalReportProps extends ReportPropsBase {
  type: typeof GLOBAL;
  associations: Array<Organization>;
}

/** CompactValues is an array of courses, hours, participants and courses per capita --
 * in that order.
 */
export type CompactValues = [number, number, number, number];

export interface Counties {
  name: string;
  courses: number;
  participants: number;
  hours: number;
  coursesPerCapita: number;
  isCurrent: boolean;
}

export interface INamed {
  name: string;
  short?: string;
}
