import { Lato, Open_Sans } from "next/font/google";

import "@/styles/globals.css";

import Container from "@/components/Containers/Container";
import Footer from "@/components/Containers/Footer";
import FooterSponsor from "@/components/FooterSponsor";
import Header from "@/components/Header";
import SuperHeader from "@/components/SuperHeader";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb" className={`${openSans.variable} ${lato.variable}`}>
      <body>
        <SuperHeader />
        <Header />
        <main className="my-4">
          <Container noPadding>{children}</Container>
        </main>
        <Footer>
          <div className="text-center">
            Statistikkbank for{" "}
            <a href="https://www.vofo.no/">Voksenopplæringsforbundet</a>
          </div>
          <FooterSponsor />
        </Footer>
      </body>
    </html>
  );
}
