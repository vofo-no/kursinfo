import { currentUser } from "@clerk/nextjs/server";

import { Article } from "@/components/article";
import { LinkButton } from "@/components/link-button";

export default async function Home() {
  const user = await currentUser();

  return (
    <>
      <Article>
        <h1>{["Hei", user?.firstName].filter(Boolean).join(", ")}!</h1>
        <p className="lead">
          Studieforbundene samarbeider om å styrke lærerne og kurslederne i
          frivillige organisasjoner.
        </p>
      </Article>
      <div className="grid sm:grid-cols-2 gap-4">
        <LinkButton href="/attest" className="flex-col">
          <h2 className="text-lg font-semibold">Kurslederattesten</h2>
          <p>Et felles utgangspunkt for å skape gode og trygge kurs.</p>
        </LinkButton>
        <LinkButton href="/profil" className="flex-col">
          <h2 className="text-lg font-semibold">Kurslederprofil</h2>
          <p>Din kompetanse og interesser som lærer og kursleder.</p>
        </LinkButton>
      </div>
    </>
  );
}
