"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";

import { authClient } from "@/lib/auth/client";

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        router.refresh();
      }}
      redirectTo="/account/settings"
      emailOTP
      signUp={false}
      organization
      credentials={false}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
