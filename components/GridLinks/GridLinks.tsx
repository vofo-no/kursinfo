import { Box } from "@vofo-no/design";
import LinkBox from "components/LinkBox";
import { FC } from "react";

interface PropTypes {
  items: Array<[string, string]>;
}

export const GridLinks: FC<PropTypes> = ({ items }) => (
  <Box
    display="grid"
    gridTemplateColumns={["1fr 1fr", "1fr 1fr 1fr"]}
    gridGap={3}
    mt={3}
  >
    {items.map(([url, title]) => (
      <LinkBox key={url} url={url} title={title} />
    ))}
  </Box>
);
