import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className={`${interSans.variable} antialiased`}>
        <ThemeProvider attribute="data-color-scheme">{children}</ThemeProvider>
      </body>
    </html>
  );
}
