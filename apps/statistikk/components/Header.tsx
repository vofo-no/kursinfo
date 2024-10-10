import React from "react";
import Link from "next/link";

import { Logo } from "@/components/Logo";

import WhiteBox from "./Containers/WhiteBox";

function Header() {
  return (
    <WhiteBox>
      <div className="max-w-screen-desktop mx-auto">
        <div className="flex items-stretch">
          <div className="tablet:ml-4">
            <Link href="/">
              <Logo className="w-[160px] tablet:w-[218px]" />
            </Link>
          </div>
        </div>
      </div>
    </WhiteBox>
  );
}

export default Header;
