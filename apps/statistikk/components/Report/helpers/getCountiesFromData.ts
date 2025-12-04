import {
  ASSOCIATION,
  COMBO,
  Counties,
  GLOBAL,
  IDataFile,
  REGION,
} from "@/types/reports";

const perCapita = (courses: number, population = 0) => {
  if (population > 0) return courses / population;
  return 0;
};

export default function getCountiesFromData(
  reports: IDataFile["reports"],
  regions: IDataFile["regions"],
  reportKey: string,
): Array<Counties> {
  const reportData = reports[reportKey];

  if (!reportData) {
    throw new Error(`Report data not found for report: ${reportKey}`);
  }

  return regions
    .filter((key) => {
      const regionReport = reports[key];
      return (
        regionReport && regionReport.type === REGION && !regionReport.isFuture
      );
    })
    .map((key) => {
      const regionReport = reports[key];

      if (regionReport?.type !== REGION) throw Error("Expected region type");
      return regionReport;
    })
    .map(
      ({
        name,
        courses,
        participants,
        hours,
        associations,
        population,
        municipalities,
      }) => {
        switch (reportData.type) {
          case ASSOCIATION: {
            if ((reportData.key as string) !== reportData.key)
              throw new Error("Unexpected association key");

            const association = associations[reportData.key];
            if (!association) {
              throw new Error(
                `Association data not found for key: ${reportData.key}`,
              );
            }

            return {
              name: name,
              courses: association.courses,
              participants:
                association.participants.males +
                association.participants.females,
              hours: association.hours,
              coursesPerCapita: perCapita(association.courses, population),
              isCurrent: false,
            };
          }
          case COMBO: {
            const aKeys = Object.keys(associations).filter((key) =>
              reportData.keys.includes(key),
            );

            return {
              name,
              courses: aKeys.reduce(
                (sum, a) => sum + associations[a]!.courses,
                0,
              ),
              participants: aKeys.reduce(
                (sum, a) =>
                  sum +
                  associations[a]!.participants.males +
                  associations[a]!.participants.females,
                0,
              ),
              hours: aKeys.reduce((sum, a) => sum + associations[a]!.hours, 0),
              coursesPerCapita: perCapita(
                aKeys.reduce((sum, a) => sum + associations[a]!.courses, 0),
                population,
              ),
              isCurrent: false,
            };
          }
          case GLOBAL:
          case REGION: {
            return {
              name,
              courses,
              participants: participants.males + participants.females,
              hours,
              coursesPerCapita: perCapita(courses, population),
              isCurrent: municipalities.every(
                (m) =>
                  "municipalities" in reportData &&
                  reportData.municipalities.includes(m),
              ),
            };
          }
        }
      },
    )
    .sort((a, b) => Number(b.coursesPerCapita) - Number(a.coursesPerCapita));
}
