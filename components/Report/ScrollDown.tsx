"use client";

import { Transition } from "@headlessui/react";
import useScrollPosition from "lib/useScrollPosition";
import { ChevronsDown } from "react-feather";

export default function ScrollDown() {
  const scrollPos = useScrollPosition();

  return (
    <Transition
      as={ChevronsDown}
      size={48}
      show={scrollPos === 0}
      appear
      enterFrom="opacity-0"
      enterTo="opacity-30"
      entered="opacity-30"
      leaveFrom="opacity-30"
      leaveTo="opacity-0"
      className="fixed opacity-30 bottom-4 transition-opacity duration-300 animate-bounce hidden left-1/2 -ml-6 tall:block"
    />
  );
}
