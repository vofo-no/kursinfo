import { PropsWithChildren } from "react";

const PageHeading = ({ children }: PropsWithChildren<{}>) => (
  <h1 className="mt-0 font-open-sans font-semibold text-4xl">{children}</h1>
);

export default PageHeading;
