"use client";

import { useState } from "react";

import { ReportMunicipality } from "@/types/reports";
import intl from "@/lib/intl";

import ReportPage from "../ReportPage";
import Table, { TableRow } from "../Table";

interface PropTypes {
  items: Array<ReportMunicipality>;
  year: string;
  name: string;
  initialLimit?: number;
}

const Municipalities = ({
  year,
  name,
  items,
  initialLimit = 25,
}: PropTypes) => {
  const [limit, setLimit] = useState(initialLimit);
  return (
    <ReportPage color="bg-amber-100" title={`Kommuner i ${name}`}>
      <Table
        title={`Kursoversikt for ${
          limit < items.length ? `topp ${limit} av ${items.length}` : "alle"
        } kommuner`}
        subtitle={`Antall kurs, timer og deltakere per kommune etter kurs pr. 1 000
          innbyggere i ${name} ${year}`}
        columns={[
          "Kommune",
          "Kurs",
          "Kurstimer",
          "Deltakere",
          "Kurs pr. 1 000 innbyggere",
        ]}
      >
        {items.slice(0, limit).map(({ name, values }, i) => {
          const [
            courses = 0,
            hours = 0,
            participants = 0,
            coursesPerCapita = 0,
          ] = values;
          return (
            <TableRow key={name} title={name} index={i}>
              <span key="courses">{intl.formatNumber(courses)}</span>
              <span key="hours">
                {intl.formatNumber(hours, {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span key="participants">{intl.formatNumber(participants)}</span>
              <span key="perCapita">
                {intl.formatNumber(coursesPerCapita * 1000, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
              </span>
            </TableRow>
          );
        })}
      </Table>
      {limit < items.length && (
        <p className="print:hidden">
          <button
            className="bg-primary text-white rounded px-3 py-2 mr-2 hover:bg-primary-darker"
            onClick={() => setLimit(limit + 25)}
          >
            Vis flere
          </button>{" "}
          <button
            className="bg-gray-200 rounded px-3 py-2 mr-2 hover:bg-gray-300"
            onClick={() => setLimit(items.length)}
          >
            Vis alle
          </button>
        </p>
      )}
    </ReportPage>
  );
};

export default Municipalities;
