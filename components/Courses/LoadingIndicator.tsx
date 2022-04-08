import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  delay: number;
  show: boolean;
}

function LoadingIndicator({ show, delay }: LoadingIndicatorProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (show) {
      setEnabled(false);
      const id = setTimeout(() => {
        setEnabled(true);
      }, delay);

      return () => clearTimeout(id);
    }
  }, [delay, show]);

  if (!enabled) return null;

  return (
    <Transition
      show={show}
      appear
      as="div"
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="absolute top-0 left-0 bottom-0 right-0 bg-white bg-opacity-75"
    >
      <div className="flex justify-center">
        <div className="w-4 h-4 my-12 mx-1 bg-gray-400 rounded-full animate-ping"></div>
      </div>
    </Transition>
  );
}

export default LoadingIndicator;
