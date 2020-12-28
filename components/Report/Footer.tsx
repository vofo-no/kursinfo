import { Box, Logo, ScrollDown } from "@vofo-no/design";

const PageFooter = (props) => (
  <Box
    margin="auto 0 0 0"
    paddingTop={3}
    display="flex"
    flexDirection="column"
    alignItems="center"
    {...props}
  >
    <Logo />
    <ScrollDown />
  </Box>
);

export default PageFooter;
