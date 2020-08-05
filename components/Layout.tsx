import Head from "next/head";
import { Container } from "vofo-design";
import Header from "./Header";

export const COLORS = {
  brand: "#a31f34",
  gray: "#878787",
  grayDark: "#58595c",
};

const Layout = ({ title, children, header = false }) => {
  const LayoutHead = (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  if (header)
    return (
      <>
        {LayoutHead}
        <Header />
        <Container variant="default" px={[0, 2, 3]}>
          <main>{children}</main>
        </Container>

        <Container variant="dark" maxWidth={null} display="flex" py={4}>
          <Container variant="dark">
            <a href="http://www.vofo.no/">Voksenopplæringsforbundet</a>
          </Container>
        </Container>
      </>
    );

  return (
    <>
      {LayoutHead}
      {children}
      <style jsx global>{`
        section {
          background: #ffffff;
        }

        section.yellow {
          background: #fff8dc;
        }
        section.blue {
          background: #e0ffff;
        }

        section.page h2 {
          margin: 0;
          font-size: 2.4rem;
          font-weight: 600;
          text-align: center;
        }

        p.subtitle {
          display: block;
          margin-top: 0 !important;
          font-size: 14px;
          font-weigth: 400;
          color: #666666;
        }

        section.page {
          page-break-before: always;
          page-break-after: always;
          display: flex;
          align-items: center;
          flex-direction: column;
          min-height: 100vh;
        }

        body {
          counter-reset: tables figures;
        }

        section.page h3 {
          margin-bottom: 6px;
        }

        section.page h3.table-label {
          counter-increment: tables;
        }

        section.page h3.figure-label {
          counter-increment: figures;
        }

        section.page h3.table-label:before {
          content: "Tabell " counter(tables) ": ";
        }

        section.page h3.figure-label:before {
          content: "Figur " counter(figures) ": ";
        }

        @media only print {
          /*
          section.page {
            justify-content: unset;
          }

          h1 {
            align-self: flex-start;
          }*/
        }

        @media not print {
          section.page {
            justify-content: center;
          }
        }

        section.page > .container {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          min-height: 100vh;
          box-sizing: border-box;
        }

        table.report-table {
          border-collapse: collapse;
        }

        table.report-table th,
        table.report-table td {
          padding: 4px 10px;
        }

        table.report-table thead th {
          font-size: smaller;
          font-weight: normal;
          text-align: right;
        }
        table.report-table thead th.left {
          text-align: left;
        }
        table.report-table tbody th,
        table.report-table tbody td {
          border-top: 1px solid #ccc;
        }
        table.report-table tbody th {
          text-align: left;
        }
        table.report-table tbody td {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </>
  );
};
export default Layout;
