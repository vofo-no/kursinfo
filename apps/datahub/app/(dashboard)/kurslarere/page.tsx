import {
  getFeatureSettings,
  getTeachersSyncedByMonthsLastFiveYears,
} from "@kursinfo/db";
import { neonAuth } from "@neondatabase/neon-js/auth/next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographyH1 } from "@/components/ui/typography";

import { SyncRow } from "./sync-row";

function listAllMonthsFiveYearsBackSinceNow() {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 60; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(month);
  }
  return months;
}

export default async function TeachersPage() {
  const months = listAllMonthsFiveYearsBackSinceNow();
  const { session } = await neonAuth();

  const featureSettings = await getFeatureSettings("kurslarer", session);
  if (!featureSettings || !featureSettings.dbScope) {
    return <div>Feature not enabled</div>;
  }

  const existingData = await getTeachersSyncedByMonthsLastFiveYears(
    featureSettings.dbScope,
  );
  return (
    <>
      <TypographyH1>Kurslærere</TypographyH1>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Synkronisering</CardTitle>
          <CardDescription>
            Status for synkronisering av kurslærere pr. måned.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Måned</TableHead>
                <TableHead className="text-right">Lærere</TableHead>
                <TableHead className="text-right">Oppdatert</TableHead>
                <TableHead>
                  <span className="sr-only">Handling</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.map((month) => {
                const existingMonthData = existingData.find(
                  (ed) => ed.month === month.toISOString().slice(0, 7),
                );
                return (
                  <SyncRow
                    key={month.toISOString()}
                    settings={featureSettings}
                    month={month}
                    existingMonthData={existingMonthData}
                  />
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
