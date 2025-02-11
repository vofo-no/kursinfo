import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="row-span-3">
      <SignIn withSignUp />
    </main>
  );
}
