import { ageGroupName } from ".";
import GraphBase from "../../Graph";
import FigureLabel from "../FigureLabel";

interface SubjectsGraphProps {
  year: number;
  ages: number[][];
}

const Graph = ({ year, ages }: SubjectsGraphProps) => {
  if (!ages[0]) return null;

  const minStartYear = year - 4;
  const calcStartYear = year + 1 - ages[0].length;
  const startYear = calcStartYear > minStartYear ? calcStartYear : minStartYear;

  const options: Highcharts.Options = {
    chart: {
      height: 300,
    },
    yAxis: {
      title: { text: null },
      endOnTick: false,
    },
    xAxis: {
      accessibility: {
        rangeDescription: `Årstall fra ${startYear} til ${year}`,
      },
      categories: Array(year - startYear + 1).map((_, i) =>
        String(startYear + i),
      ),
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: startYear,
      },
    },

    series: ages.map(
      (age, i) =>
        ({
          name: ageGroupName[i],
          data: age,
        }) as Highcharts.SeriesOptionsType,
    ),
  };

  return (
    <>
      <FigureLabel subtitle="Antall deltakere per år, etter 10-årige aldersgrupper">
        Deltakernes alder i perioden fra {startYear} til {year}
      </FigureLabel>
      <GraphBase options={options} />
    </>
  );
};

export default Graph;
