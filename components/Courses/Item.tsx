import { Text } from "@vofo-no/design";
import { FC } from "react";

import { ExtendedICourseItem } from "./constants";
import ExportSchema from "./ExportSchema";

interface ItemProps {
  course: ExtendedICourseItem;
  reportSchema?: string;
}

const Item: FC<ItemProps> = ({ course, reportSchema }) => (
  <Text as="section">
    <dl>
      <dt>Tittel</dt>
      <dd>{course.courseTitle}</dd>
      <dt>Saksnummer</dt>
      <dd>{course.caseNumber}</dd>
      <dt>Kursperiode</dt>
      <dd>
        {course.startDate}–{course.endDate}
      </dd>
      <dt>Arrangør</dt>
      <dd>{course.organizer}</dd>
      <dt>Studieplan</dt>
      <dd>{course.curriculum}</dd>
    </dl>
    {course.reportSchema && (
      <p>
        <ExportSchema reportSchema={reportSchema} course={course} />
      </p>
    )}
  </Text>
);

export default Item;
