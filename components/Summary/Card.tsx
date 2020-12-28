import { Icon as FeatherIcon } from "react-feather";
import { Text, Box } from "@vofo-no/design";

type CardProps = {
  Icon: FeatherIcon;
  children: JSX.Element | string;
  label: string;
};

function Card({ Icon, children, label }: CardProps) {
  return (
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
}

export default Card;
