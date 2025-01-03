"use client";

import * as React from "react";

import {
  DbUserRecord,
  getUserRecordSnapshopByUid,
} from "@/lib/firebase/firestore";

import { AuthContext, User } from "./auth-context";

interface AuthProviderProps {
  user: User | null;
  children: React.ReactNode;
}

interface DbUserRecordState {
  ready: boolean;
  userRecord?: DbUserRecord;
}

interface DbUserRecordSnapshotAction {
  type: "SNAPSHOT";
  payload?: DbUserRecord;
}

function reducer(
  state: DbUserRecordState,
  action: DbUserRecordSnapshotAction,
): DbUserRecordState {
  if (action.type === "SNAPSHOT") {
    return {
      ready: true,
      userRecord: action.payload,
    };
  }

  return state;
}

export function AuthProvider({ user, children }: AuthProviderProps) {
  const [userRecordState, dispatchUserRecord] = React.useReducer(reducer, {
    ready: false,
  });

  const handleUserSnapshot = (nextUserRecord: DbUserRecord) => {
    dispatchUserRecord({ type: "SNAPSHOT", payload: nextUserRecord });
  };

  React.useEffect(() => {
    if (user) {
      return getUserRecordSnapshopByUid(user.uid, handleUserSnapshot);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        ...userRecordState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
