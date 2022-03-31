import { PropsWithChildren } from "react";

function Container({ children }: PropsWithChildren<{}>) {
  return (
    <div className="my-6 tablet:mx-6">
      <div className="max-w-screen-desktop mx-auto">{children}</div>
    </div>
  );
}

export default Container;
