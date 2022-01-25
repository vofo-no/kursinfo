const TENANT = "2510";

import Courses from "components/Courses";
import { CoursesProps } from "components/Courses/constants";
import SktHeader from "components/Courses/customHeaders/SktHeader";
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
    <SktHeader />
    <Courses
      {...props}
      contactEmail="post@kulturogtradisjon.no"
      contactUrl="https://www.kulturogtradisjon.no"
    />
  </>
);

export default Wrapped;
