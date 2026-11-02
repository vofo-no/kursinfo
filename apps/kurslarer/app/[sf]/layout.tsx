import { Suspense } from "react";
import Link from "next/link";
import { Tag } from "@digdir/designsystemet-react";
import { HeartIcon } from "@phosphor-icons/react/ssr";

import { sfNames } from "@/lib/sf";
import { ModeToggle } from "@/components/mode-toggle";

export function generateStaticParams() {
  return [...sfNames.keys()].map((sf) => ({ sf }));
}

export default function SfLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ sf: string }>;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col gap-6">
      <header className="bg-accent text-accent-foreground py-6 border-b">
        <div className="container">
          <Suspense fallback={<Heading />}>
            <ScopedHeading params={params} />
          </Suspense>
          <p className="text-muted-foreground">
            Finn kurslærer med riktig erfaring og kompetanse.
          </p>
        </div>
      </header>
      <main className="container">{children}</main>
      <footer className="bg-accent text-accent-foreground py-6 mt-auto border-t">
        <div className="container flex justify-between items-center">
          <p className="text-sm flex items-center gap-2">
            <HeartIcon className="text-red-600" /> Laget av Vofo med data fra
            studieforbundets kurssystem.
          </p>
          <ModeToggle />
        </div>
      </footer>
    </div>
  );
}

function Heading({ sf }: { sf?: string }) {
  return (
    <h1 className="text-2xl font-semibold">
      {sf ? (
        <Link href={`/${sf}`}>Kurslærer-katalog</Link>
      ) : (
        "Kurslærer-katalog"
      )}{" "}
      <Tag variant="outline" className="align-text-top">
        beta
      </Tag>
      {sf && <> for {sfNames.get(sf)}</>}
    </h1>
  );
}

async function ScopedHeading({ params }: { params: Promise<{ sf: string }> }) {
  const { sf } = await params;
  return <Heading sf={sf} />;
}
