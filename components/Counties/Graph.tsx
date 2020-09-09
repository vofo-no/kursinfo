import GraphBase from "../Graph";

interface PropTypes {
  year: number;
  type: "Kurs" | "Timer" | "Deltakere";
  unit: string;
  values: number[];
  totalUnit?: "hele landet" | "alle studieforbund";
  totalValues?: number[];
}

function Graph({
  year,
  type,
  unit,
  values,
  totalUnit,
  totalValues,
}: PropTypes) {
  const minStartYear = year - 4;
  const calcStartYear = year + 1 - values.length;
  const startYear = calcStartYear > minStartYear ? calcStartYear : minStartYear;

  const yAxis = [
    {
      endOnTick: false,
      title: {
        text: `${type} i ${unit}`,
      },
    },
  ] as [any];

  const series = [
    {
      name: `${type} i ${unit}`,
      data: values,
      yAxis: 0,
      zIndex: 1,
    },
  ] as [any];

  if (totalValues) {
    yAxis.push({
      gridLineWidth: 0,
      endOnTick: false,
      title: {
        text: `${type} i ${totalUnit}`,
        style: {
          color: "rgb(144, 237, 125)",
        },
      },
      labels: {
        style: {
          color: "rgb(144, 237, 125)",
        },
      },
      opposite: true,
    });

    series.push({
      name: `${type} i ${totalUnit}`,
      data: totalValues,
      yAxis: 1,
      color: "rgb(144, 237, 125)",
      zIndex: 0,
    });
  }

  const options = {
    chart: {
      height: 200,
    },
    yAxis,
    xAxis: {
      accessibility: {
        rangeDescription: `Årstall fra ${startYear} til ${year}`,
      },
      categories: Array(year - startYear + 1).map((_, i) =>
        String(startYear + i)
      ),
    },
    legend: {
      enabled: false,
    },
    tooltip: { shared: true },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: startYear,
      },
    },
    series,
  };

  return (
    <>
      <h3 className="figure-label">
        {type} i perioden fra {startYear} til {year}
      </h3>
      <p className="subtitle">
        Antall {type.toLowerCase()} per år, i {unit}
        {totalValues && ` og ${totalUnit}`}
      </p>
      <GraphBase options={options} />
    </>
  );
}

export default Graph;
