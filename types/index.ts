export const ASSOCIATION = "ASSOCIATION";
export const REGION = "REGION";

type Participants = {
  males: number;
  females: number;
  ages?: number[];
};

type Sums = {
  courses: number;
  participants: Participants;
  hours: number;
};

type Historical = {
  courses: number[];
  participants: number[];
  hours: number[];
};

export type ReportProps = {
  year: string;
  type: typeof ASSOCIATION | typeof REGION;
  report: {
    name: string;
    courses: number;
    participants: {
      males: number;
      females: number;
      ages?: number[][];
    };
    hours: number;
    facilitated: Sums;
    organizations: number;
    population?: number;
    associations: {
      [key: string]: Sums & {};
    };
    municipalities: string[];
    isFuture?: boolean;
    historical: Historical;
    historicalAll: Historical;
    mainSubjects: {
      [key: string]: {
        participants: Participants;
      };
    };
    topSubjects: string[][];
    subjects: {
      [key: string]: {
        participants: Participants;
      };
    };
  };
  municipalities: {
    [key: string]: Sums & {
      name: string;
      pop: number;
      coursesPerCapita: number;
    };
  };
  counties: {
    name: string;
    courses: number;
    participants: number;
    hours: number;
    coursesPerCapita: number;
    isCurrent: boolean;
  }[];
};

export interface RegionReportProps extends ReportProps {}
export interface AssociationReportProps extends ReportProps {}
