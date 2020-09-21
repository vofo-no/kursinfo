import fs from "fs";
import path from "path";

import Report from "../../components/Report";
import { years } from "../../data/index.json";
import getReportStaticData from "../../components/Report/getReportStaticData";

export async function getStaticProps({ params }) {
  return getReportStaticData(params);
}

export async function getStaticPaths() {
  let paths = [];
  years.map((year) => {
    const dataPath = path.join(process.cwd(), `data/${year}.json`);
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8")).reports;
    Object.keys(data).map((report) => {
      paths.push({ params: { year, report } });
    });
  });
  return { paths, fallback: false };
}

export default Report;
