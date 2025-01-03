export function PageHeader(props: React.PropsWithChildren) {
  return (
    <h1
      {...props}
      className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0"
    />
  );
}

export function PageHeaderLead(props: React.PropsWithChildren) {
  return <p {...props} className="text-xl text-muted-foreground" />;
}
