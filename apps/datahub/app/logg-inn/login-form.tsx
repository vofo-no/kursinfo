"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  AuthError,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  UserCredential,
} from "firebase/auth";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";

import { loginWithCredential } from "@/lib/firebase/api";
import { getFirebaseAuth } from "@/lib/firebase/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SwitchLoader } from "@/components/switch-loader";

const FormRootError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { errors } = useFormState();
  const rootError = errors.root;
  if (!rootError) {
    return null;
  }
  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {rootError.message}
    </p>
  );
});
FormRootError.displayName = "FormRootError";

const formSchema = z.object({
  email: z.string().email({ message: "Du må oppgi en gyldig e-postadresse." }),
});

export function LoginForm() {
  const [storedEmail, setStoredEmail] = React.useState<string>(() => {
    const value = window.localStorage.getItem("emailForSignIn");

    return value !== null ? JSON.parse(value) : "";
  });
  React.useEffect(() => {
    if (storedEmail) {
      window.localStorage.setItem(
        "emailForSignIn",
        JSON.stringify(storedEmail),
      );
    } else {
      window.localStorage.removeItem("emailForSignIn");
    }
  }, [storedEmail]);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [hasLogged, setHasLogged] = React.useState(false);

  const handleLogin = useCallback(
    async (credential: UserCredential) => {
      await loginWithCredential(credential);
      router.refresh();
    },
    [router],
  );

  const handleLoginWithEmailLinkCallback = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return;
    }

    let email = JSON.parse(window.localStorage.getItem("emailForSignIn") || "");

    if (!email) {
      email = window.prompt("Bekreft e-postadressen din");
    }

    if (!email) {
      return;
    }

    setHasLogged(false);

    await handleLogin(
      await signInWithEmailLink(auth, email, window.location.href),
    );
    window.localStorage.removeItem("emailForSignIn");

    setHasLogged(true);
  }, [handleLogin]);

  React.useEffect(() => {
    handleLoginWithEmailLinkCallback();
  }, [handleLoginWithEmailLinkCallback]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const auth = getFirebaseAuth();
      setStoredEmail(values.email);

      await sendSignInLinkToEmail(auth, values.email, {
        url: process.env.NEXT_PUBLIC_ORIGIN + "/logg-inn",
        handleCodeInApp: true,
      });
    } catch (error) {
      const { code, message } = error as AuthError;
      switch (code) {
        default:
          form.setError("root", {
            message: message || "Ukjent feil",
          });
      }
    }
  }

  if (hasLogged) return <SwitchLoader />;

  if (storedEmail)
    return (
      <div className="py-6 px-2 text-center space-y-4">
        <p>
          Vi har sendt en lenke på e-post til <strong>{storedEmail}</strong>.
        </p>
        <Button variant="outline" onClick={() => setStoredEmail("")}>
          Oppgi en annen e-postadresse
        </Button>
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-postadresse</FormLabel>
              <FormControl>
                <Input placeholder="din@epost.no" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormRootError />
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 motion-safe:animate-spin" />{" "}
              Logger inn...
            </>
          ) : (
            "Logg inn"
          )}
        </Button>
      </form>
    </Form>
  );
}
