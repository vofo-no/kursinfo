import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: { template: "%s | Datahub fra Vofo", default: "Datahub fra Vofo" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className="min-h-svh bg-background font-sans antialiased">
        <AuthProvider>
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
