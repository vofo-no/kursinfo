"use client";

import * as React from "react";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import type {
  KindeOrganization,
  KindeOrganizations,
} from "@kinde-oss/kinde-auth-nextjs/types";
import { CheckIcon, ChevronsUpDown, DatabaseIcon } from "lucide-react";

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

export function TeamSwitcher() {
  const {
    organization,
    userOrganizations,
  }: {
    organization?: KindeOrganization;
    userOrganizations?: KindeOrganizations;
  } = useKindeBrowserClient();

  const { isMobile } = useSidebar();

  if (!userOrganizations?.orgs.length || !organization) return null;

  if (userOrganizations.orgs.length === 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DatabaseIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="line-clamp-2 text-balance font-semibold">
              {organization.orgName}
            </span>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

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
                  {organization.orgName || "???"}
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
            {userOrganizations.orgs.map((team) => (
              <DropdownMenuItem
                key={team.name}
                disabled={team.code === organization.orgCode}
                className="gap-2 p-2"
                asChild
              >
                <LoginLink orgCode={team.code}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {team.code === organization.orgCode ? (
                      <CheckIcon className="size-4 shrink-0" />
                    ) : (
                      <DatabaseIcon className="size-4 shrink-0" />
                    )}
                  </div>
                  <span className="line-clamp-2 text-balance">{team.name}</span>
                </LoginLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
