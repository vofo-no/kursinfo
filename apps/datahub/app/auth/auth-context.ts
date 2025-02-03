import { createContext, useContext } from "react";

import { User } from "@/lib/user";

export interface AuthContextValue {
  user: User | null;
  nextScope?: string;
  setNextScope?: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);
