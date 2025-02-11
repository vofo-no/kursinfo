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
        <body>
          <div className="grid grid-rows-[20px_1fr_20px] grid-cols-1 justify-items-center bg-linear-to-br from-slate-50 to-slate-300 min-h-screen gap-16 p-6 pb-16 sm:p-16">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
