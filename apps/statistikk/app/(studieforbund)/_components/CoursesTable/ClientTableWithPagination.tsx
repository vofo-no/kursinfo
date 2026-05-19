"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import ClientTable from "./ClientTable";

type Props = Omit<React.ComponentProps<typeof ClientTable>, "page">;

function ClientTableInner(props: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  return <ClientTable {...props} page={page} />;
}

export default function ClientTableWithPagination(props: Props) {
  return (
    <Suspense fallback={null}>
      <ClientTableInner {...props} />
    </Suspense>
  );
}
