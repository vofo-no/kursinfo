"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  function handleOpenChange() {
    router.back();
  }

  return (
    <Dialog defaultOpen open onOpenChange={handleOpenChange}>
      <DialogContent className={className || ""}>{children}</DialogContent>
    </Dialog>
  );
}
