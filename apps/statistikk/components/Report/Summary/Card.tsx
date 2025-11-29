import { Icon as FeatherIcon } from "react-feather";

interface CardProps {
  Icon: FeatherIcon;
  label: string;
}

function Card({ Icon, children, label }: React.PropsWithChildren<CardProps>) {
  return (
    <div className="flex flex-col justify-start items-center text-center">
      <Icon size={48} />
      <span className="font-open-sans text-4xl font-bold text-primary">
        {children}
      </span>
      <span>{label}</span>
    </div>
  );
}

export default Card;
