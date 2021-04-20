import { BaseStyles } from "@vofo-no/design";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";
import { resetIdCounter } from "react-tabs";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const { locale } = router;
  resetIdCounter();
  return (
    <IntlProvider locale={locale || "nb"}>
      <BaseStyles>
        <Component {...pageProps} />
      </BaseStyles>
    </IntlProvider>
  );
}

export default MyApp;
