import GraphBase from "../Graph";

type CountiesGraphProps = {
  year: number;
  type: "Kurs" | "Timer" | "Deltakere";
  county: string;
  values: number[];
  nationalValues: number[];
};

function Graph({
  year,
  type,
  county,
  values,
  nationalValues,
}: CountiesGraphProps) {
  const minStartYear = year - 4;
  const calcStartYear = year + 1 - values.length;
  const startYear = calcStartYear > minStartYear ? calcStartYear : minStartYear;

  const options = {
    chart: {
      height: 200,
    },
    yAxis: [
      {
        endOnTick: false,
        title: {
          text: `${type} i ${county}`,
        },
      },
      {
        gridLineWidth: 0,
        endOnTick: false,
        title: {
          text: `${type} i hele landet`,
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
      },
    ],
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

    series: [
      {
        name: `${type} i ${county}`,
        data: values,
        yAxis: 0,
        zIndex: 1,
      },
      {
        name: `${type} i hele landet`,
        data: nationalValues,
        yAxis: 1,
        color: "rgb(144, 237, 125)",
        zIndex: 0,
      },
    ],
  };

  return (
    <>
      <h3 className="figure-label">
        {type} i perioden fra {startYear} til {year}
      </h3>
      <p className="subtitle">
        Antall {type.toLowerCase()} per år, i {county} og hele landet
      </p>
      <GraphBase options={options} />
    </>
  );
}

export default Graph;
