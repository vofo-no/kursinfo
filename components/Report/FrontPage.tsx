import { ReportPropsType } from "types/reports";

import Footer from "./Footer";
import ReportHeading from "./ReportHeading";
import ReportPage from "./ReportPage";
import ScrollDown from "./ScrollDown";
import Summary from "./Summary";

function FrontPage({
  name,
  year,
  summary,
  type,
}: Pick<ReportPropsType, "name" | "year" | "summary" | "type">) {
  return (
    <ReportPage>
      <ReportHeading name={name} year={year} type={type} />
      <Summary {...summary} />
      <div className="prose mx-auto">
        <p>
          Statistikken viser kursvirksomhet i studieforbund som er godkjent og
          får tilskudd etter{" "}
          <a href="https://lovdata.no/dokument/NL/lov/2009-06-19-95">
            voksenopplæringsloven
          </a>
          . Denne rapporten viser kurs som er gjennomført
          {type !== "GLOBAL" && (
            <>
              {" "}
              i <span className="whitespace-nowrap">{name}</span>
            </>
          )}{" "}
          i {year}.
        </p>
        <p>
          For mer informasjon, se <a href="http://www.vofo.no">vofo.no</a> eller
          kontakt Vofo på <a href="mailto:vofo@vofo.no">vofo@vofo.no</a>.
        </p>
        <Footer />
      </div>
      <ScrollDown />
    </ReportPage>
  );
}

export default FrontPage;
