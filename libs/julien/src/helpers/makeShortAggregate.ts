import { CourseStatuses } from "../constants";
import { ITenantData } from "../types";

interface OrganizationAggregate {
  name: string;
  code: string;
  courses: number;
  coursesPlanned: number;
  hours: number;
  hoursPlanned: number;
}

interface ShortAggregate {
  buildTime: string;
  organizations: Array<OrganizationAggregate>;
}

export function makeShortAggregate(data: ITenantData): ShortAggregate {
  const result = {
    buildTime: data.buildTime,
    organizations: data.organizationParams
      .map((code) =>
        analyzeOrganization(
          code,
          data.organizations[Number(code)] || "Ukjent",
          data.items.filter((item) => item.organizationCode === code),
        ),
      )
      .sort((a, b) => b.hoursPlanned - a.hoursPlanned)
      .sort((a, b) => b.hours - a.hours),
  };
  return result;
}

function analyzeOrganization(
  code: string,
  name: string,
  items: ITenantData["items"],
): OrganizationAggregate {
  const out = {
    name,
    code,
    courses: 0,
    coursesPlanned: 0,
    hours: 0,
    hoursPlanned: 0,
  };

  return items.reduce((result, item) => {
    if (item.status === CourseStatuses.DONE) {
      result.hours += item.hours;
      result.courses++;
    } else {
      result.hoursPlanned += item.hours;
      result.coursesPlanned++;
    }
    return result;
  }, out);
}
