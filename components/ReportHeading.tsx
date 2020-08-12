import styled from "@emotion/styled";
import { Container, Text } from "vofo-design";

const Heading = styled.h1`
  align-self: start;
  margin: 40px 0 auto 0;
`;

const ReportTag = styled(Container)`
  position: absolute;
  top: 0;
  right: 10px;
`;
const ReportTagText = styled(Text.Inline)`
  @media (min-width: 725px) {
    writing-mode: vertical-lr;
  }
  position: relative;
`;

function ReportHeading({ name, year }) {
  return (
    <Heading>
      <Text.Block fontSize={4} color="gray" lineHeight="title">
        Studieforbundenes kursvirksomhet i {year}
      </Text.Block>
      <Text.Block fontSize={6}>{name}</Text.Block>
      <ReportTag variant="primary" py={[1, 2, 3]}>
        <ReportTagText fontSize={[1, 2, 3]}>Fylkesstatistikk</ReportTagText>
      </ReportTag>
    </Heading>
  );
}

export default ReportHeading;
