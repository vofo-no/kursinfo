import { Lato, Open_Sans } from "next/font/google";

import "@/styles/globals.css";

import { Logo } from "@/components/Logo";

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
        <main style={{ counterReset: "tables figures" }}>{children}</main>
        <footer className="bg-gray-200 p-2 py-8">
          <div className="max-w-fit mx-auto print:m-0 print:w-full print:max-w-none flex flex-wrap gap-4">
            <div className="prose prose-sm">
              <p>
                Voksenopplæringsforbundet (Vofo) er studieforbundenes
                interesseorganisasjon, nasjonalt og regionalt. Vårt hovedmål er
                å styrke studieforbundenes rammevilkår i arbeidet med å gi
                voksne læringsmuligheter.
              </p>
              <p>
                Du kan lære mer om studieforbund og bli bedre kjent med oss på{" "}
                <a href="https://www.vofo.no">vofo.no</a>.
              </p>
            </div>
            <div>
              <Logo className="w-40" />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
