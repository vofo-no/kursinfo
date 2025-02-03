"use client";

import { useRouter } from "next/navigation";
import { useLoadingCallback } from "react-loading-hook";

import { associations } from "@/lib/associations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateClaim } from "@/app/actions/update-claim";
import { useAuth } from "@/app/auth/auth-context";

export default function SetupPage() {
  const { user, setNextScope } = useAuth();
  const router = useRouter();

  const [handleSetScope, isSettingScope] = useLoadingCallback(
    async (nextScope: string) => {
      if (setNextScope) setNextScope(nextScope);
      await updateClaim(nextScope).then(() => {
        router.replace(`/${nextScope}`);
      });
    },
  );

  return (
    <Dialog open>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur bg-black/20" />
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Oppsett</DialogTitle>
            <DialogDescription>
              Velg studieforbundet du vil logge inn som.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {user?.scopes?.map((scope) => (
              <Button
                key={scope}
                onClick={() => handleSetScope(scope)}
                disabled={isSettingScope}
                variant="secondary"
              >
                {associations[scope]}
              </Button>
            ))}
            {!user?.scopes?.length ? (
              <div className="text-muted-foreground text-center">
                😱 Brukeren din er ikke tilknyttet et studieforbund. Kontakt
                Vofo.
              </div>
            ) : null}
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
