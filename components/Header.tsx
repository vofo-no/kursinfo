import { useState } from "react";
import Link from "next/link";
import React from "react";
import styled from "@emotion/styled";

import { Logo, Menu, MenuContainer, MenuButton, Container } from "vofo-design";

const LogoHeading = styled.h1`
  margin: 0 16px 0 0 !important;
  padding: 0 !important;
`;

const Header = () => {
  const [menu, toggleMenu] = useState(false);
  return (
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
          <MenuButton open={menu} onClick={() => toggleMenu(!menu)} />
          <Menu open={menu}>
            <Link href="/">
              <a>Fylkesstatistikk</a>
            </Link>
          </Menu>
          <Menu variant="top" open={menu}>
            <a href="http://www.vofo.no/">
              <a className="black">Gå til vofo.no</a>
            </a>
          </Menu>
        </MenuContainer>
      </Container>
    </Container>
  );
};

export default Header;
