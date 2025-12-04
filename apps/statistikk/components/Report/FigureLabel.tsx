interface FigureLabelProps {
  subtitle?: string;
}

function FigureLabel({
  children,
  subtitle,
}: React.PropsWithChildren<FigureLabelProps>) {
  return (
    <div className="mb-3 mt-8">
      <h3
        className="before:content-['Figur_'counter(figures)':_'] font-open-sans font-bold text-xl tablet:text-2xl"
        style={{ counterIncrement: "figures" }}
      >
        {children}
      </h3>
      {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
}

export default FigureLabel;
