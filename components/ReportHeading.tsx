import { Box, Text } from "@vofo-no/design";
import { ReportProps, ASSOCIATION, REGION, TOTAL } from "../types";

const typeName = {
  [ASSOCIATION]: "Studieforbundstatistikk",
  [REGION]: "Fylkesstatistikk",
  [TOTAL]: "Kursstatistikk",
};

function ReportHeading({
  name,
  year,
  type,
}: {
  name: string;
  year: string;
  type: ReportProps["type"];
}) {
  return (
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
}

export default ReportHeading;
