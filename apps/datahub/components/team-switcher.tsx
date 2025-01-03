"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown, DatabaseIcon } from "lucide-react";
import { useLoadingCallback } from "react-loading-hook";

import { associations } from "@/lib/associations";
import { setScopeOnUserRecordByUid } from "@/lib/firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/auth-context";
import { updateClaim } from "@/app/actions/updateClaim";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { user, userRecord } = useAuth();

  const [handleSetScope, isSettingScope] = useLoadingCallback(
    async (nextScope: string) => {
      if (!user) return;

      await setScopeOnUserRecordByUid(user.uid, nextScope);
      await updateClaim();
    },
  );

  if (!user || !userRecord || typeof userRecord.scopes === "undefined")
    return null;

  if (!userRecord.currentScope) return null;

  const teams = userRecord.scopes.map((scope) => ({
    name: associations[scope] || `Ukjent (${scope})`,
    isCurrent: scope === userRecord.currentScope,
    scope,
  }));

  const activeTeam = teams.find((team) => team.isCurrent);
  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <DatabaseIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="line-clamp-2 text-balance font-semibold">
                  {activeTeam.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Studieforbund
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                disabled={team.isCurrent || isSettingScope}
                onClick={() => handleSetScope(team.scope)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {team.isCurrent ? (
                    <CheckIcon className="size-4 shrink-0" />
                  ) : (
                    <DatabaseIcon className="size-4 shrink-0" />
                  )}
                </div>
                <span className="line-clamp-2 text-balance">{team.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
