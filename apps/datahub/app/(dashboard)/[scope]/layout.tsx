"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useNavMain } from "@/lib/nav-main";
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
import { SwitchLoader } from "@/components/switch-loader";
import { useAuth } from "@/app/auth/auth-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, nextScope } = useAuth();
  const path = usePathname();
  const navMain = useNavMain();
  const { scope } = useParams();

  if (!user)
    return (
      <div className="text-xs text-muted-foreground/60">
        😱 Noe er galt i oppsettet av kontoen din.
      </div>
    );

  if (nextScope && nextScope !== scope) {
    return <SwitchLoader />;
  }

  const navMainItem = navMain.find((item) => path.startsWith(item.url));
  const navSubItem = navMainItem?.items
    .slice()
    .sort((a, b) => b.url.length - a.url.length)
    .find((item) => path.startsWith(item.url));

  return (
    <SidebarProvider>
      <AppSidebar navMain={navMain} />
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
