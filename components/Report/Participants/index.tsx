import { FormattedNumber } from "react-intl";
import { ParticipantsHistogramType } from "types/reports";

import ReportPage from "../ReportPage";
import Graph from "./Graph";

export interface ParticipantsProps {
  participantsHistogram: Array<ParticipantsHistogramType> | null;
  participantsHistogramSums: ParticipantsHistogramType | null;
  courses: number;
  year: string;
}

export const histogramGroupName = [
  "0-3",
  "4-7",
  "8-11",
  "12-15",
  "16-19",
  "20-23",
  "24-27",
  "28-31",
  "32-35",
  "36-39",
  "40+",
];

const Participants = ({
  participantsHistogram,
  participantsHistogramSums,
  year,
  courses,
}: ParticipantsProps) => {
  if (!participantsHistogram) return null;

  return (
    <>
      <ReportPage color="bg-blue-50" title="Deltakere pr. kurs">
        <div className="prose">
          <p>
            Statistikken viser alle deltakere over 14 år, som har vært tilstede
            minst 3/4 av timene på et kurs.
          </p>
        </div>
        <Graph
          year={year}
          participantsHistogram={participantsHistogram}
          participantsHistogramSums={participantsHistogramSums}
        />
        {participantsHistogram[0][0] && courses && (
          <div className="prose mt-6">
            <p>
              Siden 2021 er det krav om minst 4 tellende deltakere på hvert
              kurs.{" "}
              <span className="whitespace-nowrap">
                <strong>
                  <FormattedNumber value={participantsHistogram[0][0]} /> kurs
                </strong>{" "}
                (
                <FormattedNumber
                  style="percent"
                  minimumFractionDigits={0}
                  value={participantsHistogram[0][0] / courses}
                />
                )
              </span>{" "}
              har fått dispensasjon fra kravet om minste antall deltakere.
            </p>
          </div>
        )}
      </ReportPage>
    </>
  );
};

export default Participants;
