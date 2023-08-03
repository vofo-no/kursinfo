import { Lato, Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  weight: ["600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const lato = Lato({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

import "../../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className={`${openSans.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
