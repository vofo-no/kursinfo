import Link from "next/link";
import { HeartIcon } from "lucide-react";

import { sfNames } from "@/lib/sf";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

export default async function SfLayout({
  children,
  modal,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ sf: string }>;
}>) {
  const { sf } = await params;
  return (
    <div className="relative min-h-screen flex flex-col gap-6">
      <header className="bg-accent text-accent-foreground py-6 border-b">
        <div className="container">
          <h1 className="text-2xl font-semibold">
            <Link href={`/${sf}`}>Kurslærer-katalog</Link>{" "}
            <Badge variant="outline" className=" align-text-top ">
              beta
            </Badge>{" "}
            for {sfNames.get(sf)}
          </h1>
          <p className="text-muted-foreground">
            Finn kurslærer med riktig erfaring og kompetanse.
          </p>
        </div>
      </header>
      <main className="container">
        {children}
        {modal}
      </main>
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
