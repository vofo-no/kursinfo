import Head from "next/head";

export const COLORS = {
  brand: "#a31f34",
  gray: "#878787",
  grayDark: "#58595c",
};

const Layout = ({ title, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    {children}

    <footer>Voksenopplæringsforbundet</footer>

    <style jsx>{`
      footer {
        width: 100%;
        height: 100px;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      footer img {
        margin-left: 0.5rem;
      }

      footer a {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      section.site {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      section.yellow {
        background: #fff8dc;
      }
      section.blue {
        background: #e0ffff;
      }

      section.page h1 {
        font-size: 3.5rem;
        font-weight: 600;
        margin: auto 0;
      }

      section.page h1 small {
        font-size: 2rem;
        color: #58595c;
        display: block;
      }

      section.page h2 {
        margin: 1rem 0;
        font-size: 2.5rem;
        font-weight: 600;
      }

      section.page {
        page-break-before: always;
        page-break-after: always;
        display: flex;
        align-items: center;
        flex-direction: column;
        min-height: 100vh;
      }

      @media only print {
        section.page {
          justify-content: unset;
        }

        h1 {
          align-self: flex-start;
        }
      }
      @media not print {
        section.page {
          justify-content: center;
        }
        section.page > .container {
          padding: 3rem 2rem;
        }
      }

      section.page > .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
      }

      table.report-table {
        border-collapse: collapse;
      }

      table.report-table th,
      table.report-table td {
        padding: 6px 12px;
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

      * {
        box-sizing: border-box;
      }
    `}</style>
  </>
);

export default Layout;
