import GraphBase from "../../Graph";
import FigureLabel from "../FigureLabel";
import { histogramGroupName, ParticipantsProps } from ".";

const Graph = ({
  year,
  participantsHistogram,
  participantsHistogramSums,
}: Pick<
  ParticipantsProps,
  "year" | "participantsHistogram" | "participantsHistogramSums"
>) => {
  const series: Array<Highcharts.SeriesOptionsType> = [];

  participantsHistogram?.forEach((data, index) => {
    series.unshift({
      name: String(Number(year) - index),
      type: "column",
      data,
    });
  });

  if (participantsHistogramSums) {
    series.push({
      name: `Sum deltakere (${year})`,
      type: "line",
      data: participantsHistogramSums,
      yAxis: 1,
    });
  }

  const options: Highcharts.Options = {
    chart: {
      height: 300,
      marginTop: 5,
    },
    tooltip: {
      shared: true,
      headerFormat: "<strong>{point.key} deltakere pr. kurs</strong><br/>",
      useHTML: true,
    },
    yAxis: [
      {
        min: 0,
        title: { text: "Antall kurs" },
        endOnTick: false,
      },
      {
        min: 0,
        title: { text: "Antall deltakere" },
        endOnTick: false,
        opposite: true,
      },
    ],
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      padding: 0,
    },
    xAxis: {
      accessibility: {
        rangeDescription: `Antall deltakere pr. kurs`,
      },
      categories: histogramGroupName,
      crosshair: true,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
      },
    },
    series,
  };

  return (
    <>
      <FigureLabel subtitle="Antall kurs, etter antall deltakere på kurset">
        Antall deltakere pr. kurs i {year}
      </FigureLabel>
      <GraphBase options={options} />
    </>
  );
};

export default Graph;
