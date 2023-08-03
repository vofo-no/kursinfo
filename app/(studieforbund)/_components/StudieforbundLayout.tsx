import Footer from "components/Containers/Footer";
import FooterSponsor from "components/FooterSponsor";

export default function StudieforbundLayout({
  Header,
  tenantName,
  contactEmail,
  contactUrl,
}: {
  Header: () => React.ReactElement;
  tenantName: string;
  contactEmail: string;
  contactUrl: string;
}) {
  return function Layout({ children }: { children: React.ReactNode }) {
    return (
      <section>
        <Header />
        <main className="my-4">{children}</main>
        <Footer>
          <div className="flex tablet:items-end gap-4 flex-col items-center tablet:flex-row">
            <div className="flex-grow">
              <p className="mt-0">
                Statistikk for <strong>{tenantName}</strong>
              </p>
              <p className="text-sm">
                Kontakt studieforbundet:
                <br />
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                <br />
                <a href={contactUrl}>{contactUrl}</a>
              </p>
              <p className="text-sm mb-0">
                Statistikken lages av{" "}
                <a href="http://www.vofo.no">Voksenopplæringsforbundet</a> med
                data fra studieforbundets kurssystem.
              </p>
            </div>
            <div className="flex-shrink-0 not-prose">
              <FooterSponsor />
            </div>
          </div>
        </Footer>
      </section>
    );
  };
}
