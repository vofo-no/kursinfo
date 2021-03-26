import { BaseStyles } from "@vofo-no/design";
import type { AppProps } from "next/app";
import { resetIdCounter } from "react-tabs";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  resetIdCounter();
  return (
    <BaseStyles>
      <Component {...pageProps} />
    </BaseStyles>
  );
}

export default MyApp;
