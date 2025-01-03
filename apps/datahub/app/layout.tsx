import type { Metadata } from "next";

import "./globals.css";

import { userFromCookies } from "@/lib/user-from-cookies";
import { AuthProvider } from "@/components/auth/auth-provider";
import LoginPage from "@/components/login-page";

export const metadata: Metadata = {
  title: { template: "%s | Datahub fra Vofo", default: "Datahub fra Vofo" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await userFromCookies();

  return (
    <html lang="nb">
      <body className="min-h-svh bg-background font-sans antialiased">
        {!user && <LoginPage />}
        <AuthProvider user={user}>
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
