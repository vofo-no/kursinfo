import { BaseStyles } from "@vofo-no/design";

function MyApp({ Component, pageProps }) {
  return (
    <BaseStyles>
      <Component {...pageProps} />
    </BaseStyles>
  );
}

export default MyApp;
