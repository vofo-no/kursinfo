export const ASSOCIATION = "ASSOCIATION";
export const REGION = "REGION";

export interface INamed {
  name: string;
  short?: string;
}

export interface Dictionary<T> {
  [key: string]: T;
}

interface IParticipants {
  males: number;
  females: number;
  ages?: number[];
}

interface ISums {
  courses: number;
  participants: IParticipants;
  hours: number;
}

interface Historical {
  courses: number[];
  participants: number[];
  hours: number[];
}

export type ReportKindType = typeof ASSOCIATION | typeof REGION;

interface ISubject {
  participants: IParticipants;
}

interface IMunicipality extends ISums {
  name: string;
  pop: number;
  coursesPerCapita: number;
}

export interface IAssociation extends ISums {
  lastYearHours?: number;
}

export interface ReportProps {
  year: string;
  type: ReportKindType;
  report: {
    name: string;
    courses: number;
    participants: {
      males: number;
      females: number;
      ages?: number[][];
    };
    hours: number;
    facilitated: ISums;
    organizations: number;
    population?: number;
    associations: Dictionary<IAssociation>;
    municipalities: string[];
    isFuture?: boolean;
    historical: Historical;
    historicalAll: Historical;
    mainSubjects: Dictionary<ISubject>;
    topSubjects: string[][];
    subjects: Dictionary<ISubject>;
  };
  municipalities: Dictionary<IMunicipality>;

  counties: {
    name: string;
    courses: number;
    participants: number;
    hours: number;
    coursesPerCapita: number;
    isCurrent: boolean;
  }[];
}

export interface RegionReportProps extends ReportProps {}
export interface AssociationReportProps extends ReportProps {
  orgNames?: Dictionary<INamed>;
}
