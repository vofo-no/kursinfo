import merge from "deepmerge";
import Highcharts from "highcharts";
import HCSeriesLabel from "highcharts/modules/series-label";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";

if (typeof Highcharts === "object") {
  HCSeriesLabel(Highcharts);
}

function Graph({
  options,
}: {
  options: Partial<Highcharts.Options>;
}): JSX.Element {
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
      options,
    ),
  );
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

export const initialize = (): void => {
  const beforePrint = function () {
    Highcharts.charts.forEach((chart) => {
      if (chart) {
        chart.setSize(650, chart.chartHeight, false);
        chart.reflow();
      }
    });
  };
  const afterPrint = function () {
    Highcharts.charts.forEach((chart) => {
      if (chart) {
        chart.setSize(null, chart.chartHeight, false);
        chart.reflow();
      }
    });
  };

  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia("print");
    if ("addEventListener" in mediaQueryList) {
      mediaQueryList.addEventListener("change", (e) => {
        if (e.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }
  } else {
    window.addEventListener("onbeforeprint", beforePrint);
    window.addEventListener("onafterprint", afterPrint);
  }
};

export default Graph;
