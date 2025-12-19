import { AuthView } from "@neondatabase/neon-js/auth/react/ui";

export const dynamicParams = false;

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-6 self-center p-4 md:p-6">
      <AuthView path={path} />
      <p className="text-sm text-muted-foreground">
        Siden bruker bare nødvendige informasjonskapsler.
      </p>
    </main>
  );
}
