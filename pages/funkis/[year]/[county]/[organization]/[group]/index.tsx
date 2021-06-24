const TENANT = "2508";

import Courses from "components/Courses";
import { CoursesProps } from "components/Courses/constants";
import FunkisHeader from "components/Courses/customHeaders/FunkisHeader";
import getCoursesStaticData from "components/Courses/getStaticData";
import getCoursesStaticPaths from "components/Courses/getStaticPaths";
import { GetStaticPaths, GetStaticProps } from "next";
import { CoursesParams } from "types/courses";

export const getStaticProps: GetStaticProps<CoursesProps, CoursesParams> =
  async ({ params }) => {
    if (!params) throw new Error();
    return getCoursesStaticData(params, TENANT);
  };
export const getStaticPaths: GetStaticPaths<CoursesParams> = async () => {
  return getCoursesStaticPaths(TENANT);
};

const Wrapped: React.FC<CoursesProps> = (props) => (
  <>
    <FunkisHeader />
    <Courses
      {...props}
      contactEmail="post@funkis.no"
      contactUrl="https://www.funkis.no"
    />
  </>
);

export default Wrapped;
