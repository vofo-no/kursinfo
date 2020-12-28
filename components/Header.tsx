import { useState } from "react";
import Link from "next/link";
import React from "react";

import { Logo, Menu, MenuContainer, MenuButton, Box } from "@vofo-no/design";

const Header = () => {
  const [menu, toggleMenu] = useState(false);
  return (
    <Box boxShadow="small" variant="light" px={2} py={1}>
      <Box container display="flex" alignItems="stretch">
        <Box as="h1" margin="0 16px 0 0 !important" padding="0 !important">
          <Link href="/">
            <a>
              <Logo variant="header" />
            </a>
          </Link>
        </Box>
        <Box display="flex" flexGrow={2} flexDirection="column">
          <MenuButton open={menu} onClick={() => toggleMenu(!menu)} />
          <MenuContainer open={menu}>
            <Menu>
              <Link href="/">
                <a>Statistikk</a>
              </Link>
            </Menu>
            <Menu variant="top">
              <a href="http://www.vofo.no/">
                <a className="black">Gå til vofo.no</a>
              </a>
            </Menu>
          </MenuContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
