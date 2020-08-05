import { useState } from "react";
import Highcharts from "highcharts";
import HCSeriesLabel from "highcharts/modules/series-label";
import HighchartsReact from "highcharts-react-official";
import merge from "deepmerge";

if (typeof Highcharts === "object") {
  HCSeriesLabel(Highcharts);
}

function Graph({ options }) {
  const [chartOptions] = useState(
    merge(
      {
        title: {
          text: undefined,
        },
        subtitle: {
          text: undefined,
        },
        credits: {
          text: "Kilde: SSB",
          href: "https://www.ssb.no/voppl",
        },
        chart: {
          backgroundColor: "transparent",
          spacing: [0, 0, 5, 0],
          style: { fontFamily: "'Lato',sans-serif", fontSize: "14px" },
        },
      },
      options
    )
  );
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

export default Graph;
