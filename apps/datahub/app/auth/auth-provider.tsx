"use client";

import * as React from "react";

import { AuthContext, AuthContextValue } from "./auth-context";

export function AuthProvider({
  children,
  ...props
}: React.PropsWithChildren<AuthContextValue>) {
  const [nextScope, setNextScope] = React.useState("");
  return (
    <AuthContext.Provider
      value={{
        nextScope,
        setNextScope,
        ...props,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
