import Link from "next/link";

import { cn } from "@/lib/utils";

function LinkButton({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "border border-amber-500 shadow rounded flex px-6 py-5 gap-1 bg-amber-50 hover:bg-amber-200 transition",
        className,
      )}
    />
  );
}

export { LinkButton };
