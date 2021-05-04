import { Box } from "@vofo-no/design";

const SuperHeader = (): JSX.Element => (
  <Box variant="dark" py="2px" px={2}>
    <Box maxWidth="large" mx="auto">
      <a href="http://www.vofo.no" style={{ textDecoration: "none" }}>
        ⟵ vofo.no
      </a>
    </Box>
  </Box>
);

export default SuperHeader;
