/* eslint-disable @next/next/no-img-element */
import { Text } from "@vofo-no/design";

const FooterSponsor = (): JSX.Element => (
  <Text textAlign="center" mx="auto">
    <a href="https://vercel.com/?utm_source=vofo-kursinfo&utm_campaign=oss">
      <img src="/powered-by-vercel.svg" alt="Powered by Vercel" />
    </a>
  </Text>
);

export default FooterSponsor;
