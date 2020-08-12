import { Icon as FeatherIcon } from "react-feather";
import { Text, Container } from "vofo-design";

type CardProps = {
  Icon: FeatherIcon;
  children: JSX.Element | string;
  label: string;
};

function Card({ Icon, children, label }: CardProps) {
  return (
    <Container
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      display="flex"
      py={0}
      px={0}
    >
      <Icon size={48} />
      <Text.Block
        fontSize={5}
        lineHeight="title"
        fontWeight="bold"
        color="brand.primary"
        textAlign="center"
      >
        {children}
      </Text.Block>
      <Text.Block textAlign="center" lineHeight="title">
        {label}
      </Text.Block>
    </Container>
  );
}

export default Card;