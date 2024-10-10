import { PropsWithChildren } from "react";

import Container from "./Container";

function Footer({ children }: PropsWithChildren) {
  return (
    <footer className="dark bg-black bg-opacity-80 prose prose-invert max-w-none text-white py-4">
      <Container>{children}</Container>
    </footer>
  );
}

export default Footer;
