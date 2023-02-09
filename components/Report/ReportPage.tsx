import { PropsWithChildren } from "react";

const COLORS = {
  default: "bg-white",
  blue: "bg-blue-50",
  amber: "bg-amber-100",
} as const;

interface ReportPageProps {
  color?: (typeof COLORS)[keyof typeof COLORS];
  title?: string;
}

function ReportPage({
  children,
  color = COLORS.default,
  title,
}: PropsWithChildren<ReportPageProps>) {
  return (
    <section
      className={`${color} break-after-page grid break-before-page tablet:min-h-screen snap-start p-2 py-8 print:p-0 overflow-auto`}
    >
      <div className="max-w-fit mx-auto my-auto print:m-0 print:w-full print:max-w-none">
        {title && (
          <h2 className="font-open-sans font-bold text-3xl tablet:text-4xl text-gray-800 mb-6">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

export default ReportPage;
