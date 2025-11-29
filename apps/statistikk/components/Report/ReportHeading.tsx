import { ASSOCIATION, COMBO, GLOBAL, REGION } from "@/types/reports";

const typeName = {
  [ASSOCIATION]: "Studieforbundstatistikk",
  [REGION]: "Fylkesstatistikk",
  [GLOBAL]: "Kursstatistikk",
  [COMBO]: "Kursstatistikk",
};

interface ReportHeadingProps {
  name: string;
  year: string;
  type: keyof typeof typeName;
}

function ReportHeading({ name, year, type }: ReportHeadingProps) {
  return (
    <h1 className="self-start mb-auto font-open-sans font-semibold text-gray-800 text-xl tablet:text-2xl">
      <div>
        <span className="inline-block bg-primary text-white px-4 py-2 -mx-4 my-2 text-lg tablet:text-xl">
          {typeName[type]}
        </span>
      </div>
      <span className="text-gray-500">
        Studieforbundenes kursvirksomhet i {year}
      </span>
      <big className="block text-5xl">{name}</big>
    </h1>
  );
}

export default ReportHeading;
