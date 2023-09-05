import classNames from "classnames";
import intl from "lib/intl";

interface PlannedNumProps {
  value: number;
  isMixed?: boolean;
}

export function PlannedNum({ value, isMixed }: PlannedNumProps) {
  return (
    <>
      <span
        className={classNames(
          isMixed ? "before:content-['(+']" : "before:content-['(']",
          "after:content-[')'] after:absolute",
        )}
      >
        {intl.formatNumber(value, { maximumFractionDigits: 0 })}
      </span>
    </>
  );
}

interface Props {
  value: unknown;
  isPlanned?: boolean;
  isMixed?: boolean;
}

export default function NumericCell({ value, isPlanned, isMixed }: Props) {
  if (typeof value === "number") {
    return isPlanned ? (
      <PlannedNum value={value} isMixed={isMixed} />
    ) : (
      intl.formatNumber(value, { maximumFractionDigits: 0 })
    );
  }
  return null;
}
