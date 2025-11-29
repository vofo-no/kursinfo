"use client";

import { useEffect, useState } from "react";
import merge from "deepmerge";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCSeriesLabel from "highcharts/modules/series-label";

import { dataSource } from "@/types/reports";

if (typeof Highcharts === "object") {
  HCSeriesLabel(Highcharts);
}

const credits: Record<dataSource, Highcharts.CreditsOptions> = {
  [dataSource.SSB]: {
    text: "Kilde: SSB",
    href: "https://www.ssb.no/voppl",
  },
  [dataSource.Vofo]: {
    text: "Kilde: Vofo",
    href: "https://www.vofo.no/",
  },
};

function Graph({
  options,
  source = dataSource.SSB,
}: {
  options: Partial<Highcharts.Options>;
  source?: dataSource;
}) {
  const [chartOptions] = useState(
    merge(
      {
        title: {
          text: undefined,
        },
        subtitle: {
          text: undefined,
        },
        credits: credits[source],
        chart: {
          backgroundColor: "transparent",
          spacing: [0, 0, 5, 0],
          style: { fontFamily: "'Lato',sans-serif", fontSize: "14px" },
        },
      },
      options,
    ),
  );

  useEffect(() => {
    initialize();
  }, []);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

const initialize = (): void => {
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
