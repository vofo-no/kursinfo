import { ExtendedICourseItem } from "./constants";
import ExportSchema from "./ExportSchema";

interface ItemProps {
  course?: ExtendedICourseItem;
  reportSchema?: string;
}

const Item = ({ course, reportSchema }: ItemProps) => {
  if (!course) return null;
  return (
    <section>
      <dl>
        <dt className="text-xs font-bold mt-2 opacity-60">Tittel</dt>
        <dd>{course.title}</dd>
        <dt className="text-xs font-bold mt-2 opacity-60">Saksnummer</dt>
        <dd>{course.ID}</dd>
        <dt className="text-xs font-bold mt-2 opacity-60">Kursperiode</dt>
        <dd>
          {course.startDate}–{course.endDate}
        </dd>
        <dt className="text-xs font-bold mt-2 opacity-60">Arrangør</dt>
        <dd>{course.organizer}</dd>
        <dt className="text-xs font-bold mt-2 opacity-60">Studieplan</dt>
        <dd>{course.curriculum}</dd>
      </dl>
      {course.reportSchema && reportSchema && (
        <div className="mt-4">
          <ExportSchema reportSchema={reportSchema} course={course} />
        </div>
      )}
    </section>
  );
};

export default Item;
