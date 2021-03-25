import { BaseStyles } from "@vofo-no/design";
import { resetIdCounter } from "react-tabs";

function MyApp({ Component, pageProps }) {
  resetIdCounter();
  return (
    <BaseStyles>
      <Component {...pageProps} />
    </BaseStyles>
  );
}

export default MyApp;
