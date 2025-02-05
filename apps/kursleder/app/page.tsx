import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-linear-to-br from-slate-50 to-slate-300">
      <header className="flex gap-6 flex-wrap items-center w-full justify-between">
        <div />
        <div>
          <UserButton />
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p className="text-2xl">
          {["Hei", user?.firstName].filter(Boolean).join(", ")}!
        </p>
        <p className="text-lg max-w-prose">
          Studieforbundene samarbeider om å styrke kurslederne i frivillige
          organisasjoner.
        </p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <div>Om kurslederportalen</div>
        <div>Personvern</div>
      </footer>
    </div>
  );
}
