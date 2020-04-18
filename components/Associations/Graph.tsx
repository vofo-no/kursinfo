import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Legend,
  Tooltip,
  CartesianGrid,
} from "recharts";
import names from "./names.json";
import { COLORS } from "../Layout";

function Graph({ associationKeys, associations, year }) {
  const lastYear = String(Number(year) - 1);
  const mergeDataAt = associationKeys.length > 10 ? 9 : 10;
  const data = associationKeys.slice(0, mergeDataAt).map((key: string) => {
    const { hours } = associations[key];
    const fake =
      hours + Math.round(hours * ((Math.random() - Math.random()) / 20));
    return {
      name: names.short[key] || key,
      [lastYear]: fake,
      [year]: hours,
    };
  });
  if (mergeDataAt === 9) {
    data.push(
      associationKeys.slice(9).reduce(
        (agg, key) => {
          const { hours } = associations[key];
          const fake =
            hours + Math.round(hours * ((Math.random() - Math.random()) / 20));
          return {
            name: agg.name,
            [lastYear]: agg[lastYear] + fake,
            [year]: Number(agg[year]) + hours,
          };
        },
        { name: "Andre", [lastYear]: 0, [year]: 0 }
      )
    );
  }

  return (
    <div style={{ marginTop: "auto", paddingTop: "3rem", textAlign: "center" }}>
      <p>
        Kurstimer pr. studieforbund i {lastYear} og {year}
      </p>
      <ResponsiveContainer width={710} height={300}>
        <BarChart barGap={3} barCategoryGap="15%" data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => v.toLocaleString("nb")} />
          <Tooltip formatter={(v) => v.toLocaleString("nb")} />
          <Legend />
          <Bar dataKey={lastYear} fill={COLORS.gray} unit=" timer" />
          <Bar dataKey={year} fill={COLORS.brand} unit=" timer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
