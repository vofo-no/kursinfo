import { PropsWithChildren } from "react";
import { Dialog, DialogBackdrop, DialogTitle } from "@headlessui/react";
import { X } from "react-feather";

interface AlertDialogProps {
  open: boolean;
  close: () => void;
  title: string;
}

function AlertDialog({
  open,
  close,
  title,
  children,
}: PropsWithChildren<AlertDialogProps>) {
  return (
    <Dialog
      open={open}
      onClose={close}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur" />
        <div className="relative bg-white rounded max-w-screen-tablet mx-auto p-6">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {children}
          <button
            tabIndex={0}
            title="Lukk dialog"
            onClick={close}
            className="absolute top-0 right-0 p-2 px-3 hover:bg-[#ef4444] hover:text-white rounded-bl rounded-tr"
          >
            <X />
          </button>{" "}
        </div>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
