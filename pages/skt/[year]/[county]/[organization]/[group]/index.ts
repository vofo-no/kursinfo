const TENANT = "2510";

import Courses from "../../../../../../components/Courses";
import getCoursesStaticData from "../../../../../../components/Courses/getStaticData";
import getCoursesStaticPaths from "../../../../../../components/Courses/getStaticPaths";

export async function getStaticProps({ params }) {
  return getCoursesStaticData(params, TENANT);
}

export async function getStaticPaths() {
  return getCoursesStaticPaths(TENANT);
}

export default Courses;
