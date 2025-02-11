import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex gap-6 flex-wrap items-center justify-between w-full">
        <div />
        <div>
          <UserButton />
        </div>
      </header>
      <main className="row-start-2 w-full max-w-2xl space-y-8">{children}</main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <div>Om kurslederportalen</div>
        <div>
          <Link href="/personvern">Personvern</Link>
        </div>
      </footer>
    </>
  );
}
