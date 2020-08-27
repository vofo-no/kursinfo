import GraphBase from "../Graph";
import { ageGroupName } from "./";

type SubjectsGraphProps = {
  year: number;
  ages: number[][];
};

function Graph({ year, ages }: SubjectsGraphProps) {
  const minStartYear = year - 4;
  const calcStartYear = year + 1 - ages[0].length;
  const startYear = calcStartYear > minStartYear ? calcStartYear : minStartYear;

  const options = {
    chart: {
      height: 300,
    },
    yAxis: {
      title: false,
      endOnTick: false,
    },
    xAxis: {
      accessibility: {
        rangeDescription: `Årstall fra ${startYear} til ${year}`,
      },
      categories: Array(year - startYear + 1).map((_, i) =>
        String(startYear + i)
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

    series: ages.map((age, i) => ({
      name: ageGroupName[i],
      data: age,
    })),
  };

  return (
    <>
      <h3 className="figure-label">
        Deltakernes alder i perioden fra {startYear} til {year}
      </h3>
      <p className="subtitle">
        Antall deltakere per år, etter 10-årige aldersgrupper
      </p>
      <GraphBase options={options} />
    </>
  );
}

export default Graph;
