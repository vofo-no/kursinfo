import { PropsWithChildren, ReactNode } from "react";

interface TableProps {
  title: string;
  subtitle?: string;
  columns: Array<string>;
}

interface TableRowProps {
  index: number;
  title: ReactNode;
  children: JSX.Element[];
  highlight?: boolean;
}

export function TableRow({ index, title, children, highlight }: TableRowProps) {
  return (
    <tr
      className={`border-t border-opacity-20 border-black ${
        highlight ? " bg-amber-400" : ""
      }`}
    >
      <td className="px-2 py-0.5 tabular-nums">
        <span
          className={
            highlight
              ? "border-2 border-brand-red rounded-[100%] -my-1.5 -mx-1.5 px-1 py-1"
              : ""
          }
        >
          {index + 1}
        </span>
      </td>
      <th scope="row" className="text-left px-2 py-0.5">
        {title}
      </th>
      {children.map((value) => (
        <td key={value.key} className="px-2 py-0.5 tabular-nums">
          {value}
        </td>
      ))}
    </tr>
  );
}

function Table({
  children,
  title,
  subtitle,
  columns = [],
}: PropsWithChildren<TableProps>) {
  return (
    <>
      <div className="mt-8 mb-3">
        <h3
          className="before:content-['Tabell_'counter(tables)':_'] font-open-sans font-bold text-xl tablet:text-2xl"
          style={{ counterIncrement: "tables" }}
        >
          {title}
        </h3>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
      <table className="mb-8 w-full text-right">
        <thead className="text-sm">
          <tr>
            <th></th>
            <th className="text-left font-normal px-2 py-0.5">{columns[0]}</th>
            {columns.slice(1).map((col) => (
              <th key={col} className="font-normal px-2 py-0.5">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </>
  );
}

export default Table;
