import { Box, Logo, Menu, MenuButton, MenuContainer } from "@vofo-no/design";
import Link from "next/link";
import { FC, useState } from "react";
import React from "react";

const Header: FC = () => {
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
              <a href="http://www.vofo.no/" className="black">
                Gå til vofo.no
              </a>
            </Menu>
          </MenuContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
