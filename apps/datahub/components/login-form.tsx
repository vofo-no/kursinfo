"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AuthError, UserCredential } from "firebase/auth";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";

import { signInWithEmailAndPassword } from "@/lib/firebase/auth";
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
import { loginWithCredential } from "@/app/actions/auth";

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
  username: z
    .string()
    .email({ message: "Brukernavnet må være en e-postadresse." }),
  password: z.string().min(8, {
    message: "Passordet må være minst 8 tegn.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const credentials = await signInWithEmailAndPassword(
        values.username,
        values.password,
      );
      await handleLogin(credentials!);
    } catch (error) {
      const { code, message } = error as AuthError;
      switch (code) {
        case "auth/invalid-credential":
          form.setError("root", {
            message: "Feil brukernavn eller passord.",
          });
          break;
        default:
          form.setError("root", {
            message: message || "Ukjent feil",
          });
      }
    }
  }

  async function handleLogin(credential: UserCredential) {
    await loginWithCredential(credential);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brukernavn</FormLabel>
              <FormControl>
                <Input placeholder="din@epost.no" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passord</FormLabel>
              <FormControl>
                <Input placeholder="Ditt passord" type="password" {...field} />
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
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Logger inn...
            </>
          ) : (
            "Logg inn"
          )}
        </Button>
      </form>
    </Form>
  );
}
