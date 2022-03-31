import { PropsWithChildren } from "react";

import Container from "./Container";

function Footer({ children }: PropsWithChildren<{}>) {
  return (
    <footer className="dark bg-black text-white py-6">
      <Container>{children}</Container>
    </footer>
  );
}

export default Footer;
