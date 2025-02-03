import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/components/footer";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Dialog open>
      <DialogPortal>
        <DialogOverlay className=" backdrop-blur bg-black/20" />
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Logg inn</DialogTitle>
            <DialogDescription>
              Tjenesten er tilgjengelig for inviterte brukere.
              <br />
              Kontakt Vofo for mer informasjon.
            </DialogDescription>
          </DialogHeader>
          <LoginForm />
          <Footer />
        </div>
      </DialogPortal>
    </Dialog>
  );
}
