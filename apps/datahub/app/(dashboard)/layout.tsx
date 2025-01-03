"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navMain } from "@/lib/nav-main";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth/auth-context";
import TeamSetupDialog from "@/components/team-setup-dialog";

import { SwitchLoader } from "./switch-loader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, userRecord, ready } = useAuth();
  const path = usePathname();

  if (!ready)
    return (
      <div className="text-xs text-muted-foreground/60">🛰 Et øyeblikk...</div>
    );

  if (!user || !userRecord)
    return (
      <div className="text-xs text-muted-foreground/60">
        😱 Noe er galt i oppsettet av kontoen din.
      </div>
    );

  if (
    !user.customClaims.scope ||
    !userRecord.currentScope ||
    !userRecord.scopes?.includes(userRecord.currentScope)
  )
    return <TeamSetupDialog />;

  if (user.customClaims.scope !== userRecord.currentScope) {
    return <SwitchLoader />;
  }

  const navMainItem = navMain.find((item) => path.startsWith(item.url));
  const navSubItem = navMainItem?.items
    .slice()
    .sort((a, b) => b.url.length - a.url.length)
    .find((item) => path.startsWith(item.url));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Datahub</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {navMainItem && navSubItem && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={navMainItem.url}>{navMainItem.title}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {(navMainItem || navSubItem) && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {navSubItem?.title || navMainItem?.title}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
