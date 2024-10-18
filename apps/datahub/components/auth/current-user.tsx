"use client";

import { createHash } from "crypto";
import { useRouter } from "next/navigation";
import { useLoadingCallback } from "react-loading-hook";

import { signOut } from "@/lib/firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/auth";

import { useAuth } from "./auth-context";

export default function CurrentUser() {
  const router = useRouter();
  const { user } = useAuth();
  const [handleLogout, isLogoutLoading] = useLoadingCallback(async () => {
    await signOut();
    await logout();

    router.refresh();
  });

  const hash =
    user?.email && createHash("sha256").update(user.email).digest("hex");

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={
                  user.photoURL ||
                  `https://www.gravatar.com/avatar/${hash}?d=retro&s=64`
                }
                alt={user.email!}
              />
              <AvatarFallback>{user.email?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Min konto</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isLogoutLoading} onClick={handleLogout}>
            Logg ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Avatar className="h-9 w-9">
      <AvatarFallback>?</AvatarFallback>
    </Avatar>
  );
}
