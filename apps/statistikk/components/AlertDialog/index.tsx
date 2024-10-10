import { Dialog } from "@headlessui/react";
import { PropsWithChildren } from "react";
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
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur" />
        <div className="relative bg-white rounded max-w-screen-tablet mx-auto p-6">
          <Dialog.Title className="text-xl">{title}</Dialog.Title>
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
