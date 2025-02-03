import type { Metadata } from "next";

import "./globals.css";

import { getServerUserRecord } from "@/lib/firebase/firebase.server";
import { getTokensFromCookies } from "@/lib/get-tokens-from-cookies";
import { toUser } from "@/lib/user";

import { AuthProvider } from "./auth/auth-provider";

export const metadata: Metadata = {
  title: { template: "%s | Datahub fra Vofo", default: "Datahub fra Vofo" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokens = await getTokensFromCookies();
  const userRecord = await getServerUserRecord();

  const user = tokens ? toUser(tokens, userRecord) : null;

  return (
    <html lang="nb">
      <body className="min-h-svh bg-background font-sans antialiased">
        <AuthProvider user={user}>
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
