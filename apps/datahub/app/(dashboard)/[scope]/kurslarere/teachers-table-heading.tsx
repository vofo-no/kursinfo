import { Row } from "@tanstack/react-table";

import { numberFormat } from "@/lib/intl";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Teacher } from "@/app/types";

export function TeachersTableHeading({ rows }: { rows: Row<Teacher>[] }) {
  const rowCount = rows.length;
  const avgAge = rowCount
    ? rows
        .map((row) => row.getValue<number>("yearOfBirth"))
        .reduce((a, b) => a + b, 0) / rowCount
    : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Antall lærere</CardDescription>
          <CardTitle className="text-4xl">
            {numberFormat.format(rowCount)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Snittalder</CardDescription>
          <CardTitle className="text-4xl">
            {avgAge ? numberFormat.format(avgAge) : "--"} år
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}
