function WhiteBox({
  noPadding,
  children,
}: React.PropsWithChildren<{ noPadding?: boolean }>) {
  return (
    <div
      className={`bg-white text-black shadow ${
        noPadding ? "" : "px-2 tablet:px-6 py-4"
      }`}
    >
      {children}
    </div>
  );
}

export default WhiteBox;
