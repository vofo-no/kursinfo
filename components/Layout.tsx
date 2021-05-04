import { Box, Text } from "@vofo-no/design";
import Head from "next/head";
import { FC } from "react";

import FooterSponsor from "./FooterSponsor";
import Header from "./Header";
import SuperHeader from "./SuperHeader";

interface LayoutProps {
  title: string;
  header?: boolean;
}

const Layout: FC<LayoutProps> = ({ title, children, header = false }) => {
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
        <SuperHeader />
        <Header />
        <Box my={2} container>
          {children}
        </Box>

        <Box variant="dark" py={4}>
          <Box container>
            <Text textAlign="center" mx="auto">
              Statistikkbank for{" "}
              <a href="http://www.vofo.no/">Voksenopplæringsforbundet</a>
            </Text>
            <FooterSponsor />
          </Box>
        </Box>
      </>
    );

  return (
    <>
      {LayoutHead}
      <main>{children}</main>
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

        section.page h2.h1 {
          margin: 0;
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
          section.page,
          section.page > .container {
            width: 100%;
          }

          .no-print {
            display: none;
          }
        }

        @media not print {
          main {
            max-height: 100vh;
            overflow-y: scroll;
            scroll-snap-type: y proximity;
          }
          section.page {
            scroll-snap-align: start;
            justify-content: center;
          }
        }

        section.page > .container {
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          box-sizing: border-box;
          max-width: 100%;
        }

        .responsive-table {
          display: block;
          width: 100%;
          overflow-x: auto;
        }

        .responsive-table > table {
          width: 100%;
        }

        table.report-table {
          border-collapse: collapse;
          line-height: 1.2;
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
