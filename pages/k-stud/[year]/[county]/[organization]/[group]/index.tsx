const TENANT = "2504";

import Courses from "components/Courses";
import { CoursesProps } from "components/Courses/constants";
import KstudHeader from "components/Courses/customHeaders/KstudHeader";
import getCoursesStaticData from "components/Courses/getStaticData";
import getCoursesStaticPaths from "components/Courses/getStaticPaths";
import { GetStaticPaths, GetStaticProps } from "next";
import { CoursesParams } from "types/courses";

export const getStaticProps: GetStaticProps<
  CoursesProps,
  CoursesParams
> = async ({ params }) => {
  if (!params) throw new Error();
  return getCoursesStaticData(params, TENANT);
};
export const getStaticPaths: GetStaticPaths<CoursesParams> = async () => {
  return getCoursesStaticPaths(TENANT);
};

const Wrapped: React.FC<CoursesProps> = (props) => (
  <>
    <KstudHeader />
    <Courses
      {...props}
      contactEmail="post@k-stud.no"
      contactUrl="https://www.k-stud.no"
    />
  </>
);

export default Wrapped;
