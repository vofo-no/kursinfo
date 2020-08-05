import Link from "next/link";
import React from "react";
import styled from "@emotion/styled";

import { Logo, Menu, MenuContainer, Container } from "vofo-design";

const LogoHeading = styled.h1`
  margin: 0 16px 0 0 !important;
  padding: 0 !important;
`;

const InnerHeading = styled.h2`
    margin: 0 !important;
    padding 0 !important;
    font-size: 24px !important;
`;

const MarginlessMenu = styled(Menu)`
  margin-top: 0;
`;

const Header = () => (
  <Container maxWidth={null} boxShadow={1} variant="white" px={[0, 2, 3]}>
    <Container display="flex" alignItems="stretch">
      <LogoHeading>
        <Link href="/">
          <a>
            <Logo variant="header" />
          </a>
        </Link>
      </LogoHeading>
      <MenuContainer>
        <MarginlessMenu open>
          <Link href="/">
            <a>
              <InnerHeading>Fylkesstatistikk</InnerHeading>
            </a>
          </Link>
        </MarginlessMenu>
        <Menu variant="top" open>
          <a href="http://www.vofo.no/">
            <a className="black">Gå til vofo.no</a>
          </a>
        </Menu>
      </MenuContainer>
    </Container>
  </Container>
);

export default Header;
