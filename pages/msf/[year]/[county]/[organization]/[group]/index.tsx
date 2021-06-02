const TENANT = "2525";

import Courses from "components/Courses";
import { CoursesProps } from "components/Courses/constants";
import MsfHeader from "components/Courses/customHeaders/MsfHeader";
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
    <MsfHeader />
    <Courses
      {...props}
      contactEmail="msf@musikk.no"
      contactUrl="https://www.musikkensstudieforbund.no"
    />
  </>
);

export default Wrapped;
