"use client";

import { associations } from "@/lib/associations";
import { useAuth } from "@/components/auth/auth-context";

export default function Org() {
  const { user } = useAuth();

  return (
    <div className="relative ml-auto truncate text-sm">
      {user && user.customClaims.scope && associations[user.customClaims.scope]}
    </div>
  );
}
