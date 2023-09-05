import { FC } from "react";
import { Organization } from "types/reports";

import GraphBase from "../../Graph";
import FigureLabel from "../FigureLabel";

interface PropTypes {
  items: Array<Organization>;
  year: string;
  unit: "Studieforbund" | "Organisasjon";
}

const Graph: FC<PropTypes> = ({ items, year, unit }) => {
  const lastYear = String(Number(year) - 1);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 180,
    },
    xAxis: {
      categories: items.map(({ short, name }) => short ?? name),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: { text: null },
      endOnTick: false,
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      padding: 0,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} timer</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
      },
    },
    series: [
      {
        name: lastYear,
        data: items.map((item) => item.lastYearHours),
      },
      {
        name: year,
        data: items.map((item) => item.hours),
      },
    ] as Array<Highcharts.SeriesColumnOptions>,
  };

  return (
    <>
      <FigureLabel
        subtitle={`Antall kurstimer per år, etter ${unit.toLowerCase()}`}
      >
        {unit}enes kurstimer i {lastYear} og {year}
      </FigureLabel>
      <GraphBase options={options} />
    </>
  );
};

export default Graph;
