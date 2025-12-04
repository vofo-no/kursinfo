function Container({
  children,
  noPadding,
}: React.PropsWithChildren<{ noPadding?: boolean }>) {
  return (
    <div
      className={`max-w-screen-desktop mx-auto print:max-w-none print:w-100 ${
        noPadding ? "" : "px-2 py-4 tablet:px-6"
      }`}
    >
      {children}
    </div>
  );
}

export default Container;
