import GraphBase from "../Graph";
import names from "./names.json";

function Graph({ associationKeys, associations, year }) {
  const lastYear = String(Number(year) - 1);

  const options = {
    chart: {
      type: "column",
      height: 180,
    },
    xAxis: {
      categories: associationKeys.map((key: string) => names.short[key] || key),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: false,
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
        data: associationKeys.map(
          (key: string) => associations[key].lastYearHours
        ),
      },
      {
        name: year,
        data: associationKeys.map((key: string) => associations[key].hours),
      },
    ],
  };

  return (
    <>
      <h3 className="figure-label">
        Studieforbundenes kurstimer i {lastYear} og {year}
      </h3>
      <p className="subtitle">Antall kurstimer per år, etter studieforbund</p>
      <GraphBase options={options} />
    </>
  );
}

export default Graph;
