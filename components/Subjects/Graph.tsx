import GraphBase from "../Graph";

function Graph({ year, ages }) {
  const startYear = year - 4;

  const getAgeSeries = (age) =>
    [...Array(year - startYear + 1)].map(
      (_, i) =>
        ages[age] +
        Math.round(ages[age] * ((Math.random() - Math.random()) / 10))
    );
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

    series: [
      {
        name: "14-19 år",
        data: getAgeSeries(0),
      },
      {
        name: "20-29 år",
        data: getAgeSeries(1),
      },
      {
        name: "30-39 år",
        data: getAgeSeries(2),
      },
      {
        name: "40-49 år",
        data: getAgeSeries(3),
      },
      {
        name: "50-59 år",
        data: getAgeSeries(4),
      },
      {
        name: "60-> år",
        data: getAgeSeries(5),
      },
    ],
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
