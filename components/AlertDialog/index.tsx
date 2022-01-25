import { Box, Text } from "@vofo-no/design";
import { FC, useCallback, useEffect } from "react";
import AriaModal from "react-aria-modal";
import { X } from "react-feather";

interface AlertDialogProps {
  open: boolean;
  close: () => void;
  title: string;
}

const AlertDialog: FC<AlertDialogProps> = ({
  open,
  close,
  title,
  children,
}) => {
  const handleUserKeyPress = useCallback(
    ({ keyCode }) => {
      if (keyCode === 27) close();
    },
    [close]
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleUserKeyPress);

      return () => {
        window.removeEventListener("keydown", handleUserKeyPress);
      };
    }
  }, [open, handleUserKeyPress]);

  if (!open) return null;

  return (
    <AriaModal
      titleText={title}
      onExit={close}
      initialFocus="#alert-dialog-1-close"
      includeDefaultStyles={false}
      underlayStyle={{
        position: "fixed",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        overflowY: "auto",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="dialog">
        <Box className="dialog" variant="light" paddingY={3} paddingX={4}>
          <Text as="h2" id="alert-dialog-1-title">
            {title}
          </Text>
          {children}
          <button
            className="close"
            tabIndex={0}
            title="Lukk dialog"
            id="alert-dialog-1-close"
            onClick={close}
          >
            <X />
          </button>
        </Box>
      </div>
      <style jsx>{`
        .backdrop {
          position: fixed;
          background-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          overflow-y: auto;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .dialog {
          background: white;
          border: 2px solid gray;
          position: relative;
        }

        h2 {
          margin-right: 2rem;
          margin-top: 0;
          padding-top: 0;
        }

        .close {
          padding: 0.5rem;
          margin: 0.5rem;
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
          border: 0;
          background: transparent;
        }
      `}</style>
    </AriaModal>
  );
};

export default AlertDialog;
