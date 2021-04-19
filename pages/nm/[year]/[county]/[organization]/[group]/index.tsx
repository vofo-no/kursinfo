const TENANT = "2539";

import Courses from "components/Courses";
import { CoursesProps } from "components/Courses/constants";
import NmHeader from "components/Courses/customHeaders/NmHeader";
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
    <NmHeader />
    <Courses
      {...props}
      contactEmail="post@naturogmiljo.no"
      contactUrl="https://www.naturogmiljo.no"
    />
  </>
);

export default Wrapped;
