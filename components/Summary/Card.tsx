import { Box, Text } from "@vofo-no/design";
import { FC } from "react";
import { Icon as FeatherIcon } from "react-feather";

interface CardProps {
  Icon: FeatherIcon;
  children: JSX.Element | string;
  label: string;
}

const Card: FC<CardProps> = ({ Icon, children, label }) => (
  <Box
    flexDirection="column"
    justifyContent="flex-start"
    alignItems="center"
    display="flex"
    py={0}
    px={0}
  >
    <Icon size={48} />
    <Text
      fontSize={5}
      as="div"
      lineHeight="heading"
      fontWeight="bold"
      color="primary"
      textAlign="center"
    >
      {children}
    </Text>
    <Text textAlign="center" as="div" lineHeight="heading">
      {label}
    </Text>
  </Box>
);

export default Card;
