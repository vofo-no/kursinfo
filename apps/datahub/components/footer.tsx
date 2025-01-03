export default function Footer() {
  return (
    <p className="p-4 self-center text-sm text-muted-foreground">
      ❤ fra{" "}
      <a
        href="https://www.vofo.no/"
        className="hover:underline text-foreground"
      >
        Vofo
      </a>{" "}
      / /{" "}
      <a
        href="https://www.vofo.no/om-vofo/personvernerklaering"
        className="hover:underline text-foreground"
      >
        Personvern
      </a>
      <br />
      <span>Vi bruker informasjonskapsler (cookies) for å logge deg inn.</span>
    </p>
  );
}
