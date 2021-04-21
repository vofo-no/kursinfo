import { Text } from "@vofo-no/design";
import { FC } from "react";

import { ExtendedICourseItem } from "./constants";
import ExportSchema from "./ExportSchema";

interface ItemProps {
  course?: ExtendedICourseItem;
  reportSchema?: string;
}

const Item: FC<ItemProps> = ({ course, reportSchema }) => {
  if (!course) return null;
  return (
    <Text as="section">
      <dl>
        <dt>Tittel</dt>
        <dd>{course.title}</dd>
        <dt>Saksnummer</dt>
        <dd>{course.ID}</dd>
        <dt>Kursperiode</dt>
        <dd>
          {course.startDate}–{course.endDate}
        </dd>
        <dt>Arrangør</dt>
        <dd>{course.organizer}</dd>
        <dt>Studieplan</dt>
        <dd>{course.curriculum}</dd>
      </dl>
      {course.reportSchema && reportSchema && (
        <p>
          <ExportSchema reportSchema={reportSchema} course={course} />
        </p>
      )}
    </Text>
  );
};

export default Item;
