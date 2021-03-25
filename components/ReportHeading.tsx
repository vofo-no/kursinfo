import { Box, Text } from "@vofo-no/design";
import { FC } from "react";

import { ASSOCIATION, REGION, ReportProps, TOTAL } from "../types";

const typeName = {
  [ASSOCIATION]: "Studieforbundstatistikk",
  [REGION]: "Fylkesstatistikk",
  [TOTAL]: "Kursstatistikk",
};

interface ReportHeadingProps {
  name: string;
  year: string;
  type: ReportProps["type"];
}

const ReportHeading: FC<ReportHeadingProps> = ({ name, year, type }) => (
  <Box alignSelf="start" margin="40px 0 auto 0" as="h1">
    <Text
      fontSize={4}
      as="div"
      color="gray"
      lineHeight="heading"
      fontFamily="heading"
    >
      Studieforbundenes kursvirksomhet i {year}
    </Text>
    <Text fontSize={6} as="div" lineHeight="heading" fontFamily="heading">
      {name}
    </Text>
    <Box
      variant="primary"
      py={[1, 2, 3]}
      px={3}
      position="absolute"
      top={0}
      right="10px"
    >
      <Text as="span" fontSize={[1, 2, 3]} vertical="responsive">
        {typeName[type]}
      </Text>
    </Box>
  </Box>
);

export default ReportHeading;
