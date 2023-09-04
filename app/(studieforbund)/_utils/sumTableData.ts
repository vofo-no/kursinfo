import { CourseStatus, IndexedCourseItem } from "types/courses";

interface Sum {
  planned: number;
  done: number;
  total: number;
}

function calculate(sum: Sum, status: CourseStatus, value: number = 0) {
  sum.total += value;

  if (status === CourseStatus.PLANNED) {
    sum.planned += value;
  } else {
    sum.done += value;
  }

  return sum;
}

export type SummableIndexedCourseItem = Pick<
  Record<keyof IndexedCourseItem, Sum>,
  "ID" | "grant" | "hours" | "participants"
>;

const initialSum: Sum = { planned: 0, done: 0, total: 0 };

export default function sumTableData(items: IndexedCourseItem[]) {
  let result: SummableIndexedCourseItem = {
    ID: { ...initialSum },
    grant: { ...initialSum },
    hours: { ...initialSum },
    participants: { ...initialSum },
  };

  items.map((row) => {
    result.ID = calculate(result.ID, row.status, 1);
    result.grant = calculate(result.grant, row.status, row.grant);
    result.hours = calculate(result.hours, row.status, row.hours);
    result.participants = calculate(
      result.participants,
      row.status,
      row.participants,
    );
  });

  return result;
}
