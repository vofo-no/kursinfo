import { signInWithEmailAndPassword as _signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase/clientApp";

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
) {
  try {
    return _signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
}
