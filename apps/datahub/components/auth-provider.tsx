"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";

import { authClient } from "@/lib/auth/client";

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        router.refresh();
      }}
      redirectTo="/account/settings"
      emailOTP
      signUp={false}
      organization
      credentials={false}
      Link={Link}
      localization={{
        SIGN_IN: "Logg inn",
        SIGN_IN_DESCRIPTION: "Logg inn på kontoen din.",
        SIGN_OUT: "Logg ut",
        NAME: "Navn",
        NAME_DESCRIPTION: "Ditt fulle navn.",
        NAME_INSTRUCTIONS: "Maks 32 tegn.",
        EMAIL: "E-post",
        EMAIL_DESCRIPTION: "E-postadressen knyttet til kontoen din.",
        EMAIL_INSTRUCTIONS: "Sørg for at e-posten er gyldig.",
        SAVE: "Lagre",
        ACCOUNT: "Brukerkonto",
        SECURITY: "Sikkerhet",
        SESSIONS: "Økter",
        SESSIONS_DESCRIPTION:
          "Administrer dine aktive økter på forskjellige enheter og nettlesere.",
        CURRENT_SESSION: "Denne økten",
        ORGANIZATIONS: "Organisasjoner",
        ORGANIZATIONS_DESCRIPTION:
          "Administrer organisasjonene du er medlem av.",
        ORGANIZATIONS_INSTRUCTIONS:
          "Velg en organisasjon for å se eller administrere innstillingene.",
        CREATE_ORGANIZATION: "Opprett organisasjon",
        ORGANIZATION_NAME: "Organisasjonsnavn",
        ORGANIZATION_NAME_DESCRIPTION:
          "Navnet på organisasjonen din som det vil vises for andre brukere.",
        ORGANIZATION_NAME_INSTRUCTIONS: "Maks 32 tegn.",
        MEMBERS: "Medlemmer",
        MEMBERS_DESCRIPTION: "Administrer medlemmer av organisasjonen din.",
        MEMBERS_INSTRUCTIONS:
          "Inviter nye medlemmer ved å legge til e-postadressen deres.",
        INVITE_MEMBER: "Inviter nytt medlem",
        MANAGE_ORGANIZATION: "Administrer organisasjonen",
        LEAVE_ORGANIZATION: "Forlat organisasjonen",
        DELETE_ORGANIZATION: "Slett organisasjon",
        DELETE_ORGANIZATION_DESCRIPTION:
          "Sletter organisasjonen permanent. Handlingen kan ikke angres.",
        OWNER: "Eier",
        ADMIN: "Administrator",
        MEMBER: "Medlem",
        SETTINGS: "Innstillinger",
        EMAIL_OTP_SEND_ACTION: "Send engangskode",
        EMAIL_OTP: "Engangskode fra e-post",
        EMAIL_OTP_VERIFY_ACTION: "Verifiser koden",
        REVOKE: "Fjern tilgang",
        CANCEL: "Avbryt",
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
