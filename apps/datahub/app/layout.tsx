import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/components/auth/auth-provider";
import UserC from "@/components/auth/current-user";
import Footer from "@/components/footer";
import LoginPage from "@/components/login-page";
import NavSheet from "@/components/nav-sheet";
import NavSidebar from "@/components/nav-sidebar";
import Org from "@/components/org";
import { userFromCookies } from "@/components/auth/user-from-cookies";

export const metadata: Metadata = {
  title: { template: "%s | Datahub fra Vofo", default: "Datahub fra Vofo" },
};

export default async function RootLayout({
  children,
  breadcrumbs,
}: Readonly<{
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
}>) {
  const user = await userFromCookies()

  return (
    <html lang="nb">
      <body className={`antialiased min-h-screen flex flex-col bg-muted/40`}>
        {!user && <LoginPage />}
        <AuthProvider user={user}>
          <div className="flex w-full flex-col">
            <NavSidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <NavSheet />
                {breadcrumbs}
                <Org />
                <UserC />
              </header>
              {children}
            </div>
          </div>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
