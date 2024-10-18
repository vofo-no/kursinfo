import * as React from "react";
import Image from "next/image";

import underConstructionImage from "./undraw_under_construction.svg";

export default function Dashboard() {
  return (
    <main className="my-4 p-4">
      <div className="mx-auto max-w-96">
        <Image src={underConstructionImage} alt="Reisverk" />
        <p className="my-4 text-center text-2xl">
          La oss bygge noe her etterhvert...
        </p>
      </div>
    </main>
  );
}
