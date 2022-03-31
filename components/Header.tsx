import { Logo } from "@vofo-no/ui";
import Link from "next/link";
import React from "react";

import WhiteBox from "./Containers/WhiteBox";

function Header() {
  return (
    <WhiteBox>
      <div className="max-w-screen-desktop mx-auto">
        <div className="flex items-stretch">
          <div className="tablet:ml-4">
            <Link href="/">
              <a>
                <Logo className="w-[160px] tablet:w-[218px]" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </WhiteBox>
  );
}

export default Header;
