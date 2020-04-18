import { Icon as FeatherIcon } from "react-feather";
import { COLORS } from "../Layout";

type CardProps = {
  Icon: FeatherIcon;
  children: JSX.Element | string;
  label: string;
};

function Card({ Icon, children, label }: CardProps) {
  return (
    <div className="card">
      <Icon size={48} />
      <big>{children}</big>
      {label}
      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          color: ${COLORS.grayDark};
        }

        .card big {
          font-weight: bold;
          font-size: 2.5rem;
          color: ${COLORS.brand};
        }
      `}</style>
    </div>
  );
}

export default Card;
