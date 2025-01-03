import { createContext, useContext } from "react";
import { UserInfo } from "firebase/auth";

import { DbUserRecord } from "@/lib/firebase/firestore";

export interface User extends UserInfo {
  emailVerified: boolean;
  customClaims: {
    scope?: string;
    [key: string]: unknown;
  };
}

export interface AuthContextValue {
  user: User | null;
  userRecord?: DbUserRecord;
  ready: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
});

export const useAuth = () => useContext(AuthContext);
