import { nbNO } from "@clerk/localizations";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={nbNO}>
      <html lang="nb">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
