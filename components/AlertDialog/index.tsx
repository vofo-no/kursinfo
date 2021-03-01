import { Box, Text } from "@vofo-no/design";
import { FC, useCallback, useEffect, useRef } from "react";
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
  if (!open) return null;
  const r = useRef(null);

  const handleUserKeyPress = useCallback(({ keyCode }) => {
    if (keyCode === 27) close();
  }, []);

  const handleClick = useCallback((event) => {
    if (r.current && !r.current.contains(event.target)) close();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

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
          <a
            className="close"
            tabIndex={0}
            type="button"
            title="Lukk dialog"
            id="alert-dialog-1-close"
            onClick={close}
          >
            <X />
          </a>
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
        }
      `}</style>
    </AriaModal>
  );
  return (
    <>
      <div className="backdrop" onClick={handleClick}>
        <div
          role="dialog"
          aria-labelledby="alert-dialog-1-title"
          aria-modal="true"
          ref={r}
        ></div>
      </div>
      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
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

        [role="dialog"] {
          background: white;
          border: 2px solid gray;
          padding: 2rem;
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
        }
      `}</style>
    </>
  );
};

export default AlertDialog;