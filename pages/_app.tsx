import "../styles/globals.css";

import { shouldPolyfill as shouldPolyfillDateTimeFormat } from "@formatjs/intl-datetimeformat/should-polyfill";
import { shouldPolyfill as shouldPolyfillNumberFormat } from "@formatjs/intl-numberformat/should-polyfill";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";

function polyfill() {
  if (shouldPolyfillNumberFormat("nb")) {
    import("@formatjs/intl-numberformat/polyfill-force");
    import("@formatjs/intl-numberformat/locale-data/nb");
  }

  if (shouldPolyfillDateTimeFormat("nb")) {
    import("@formatjs/intl-datetimeformat/polyfill-force");
    import("@formatjs/intl-datetimeformat/add-all-tz");
    import("@formatjs/intl-datetimeformat/locale-data/nb");
  }
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const { locale } = router;
  polyfill();

  return (
    <IntlProvider locale={locale || "nb"}>
      <Component {...pageProps} />
    </IntlProvider>
  );
}

export default MyApp;
