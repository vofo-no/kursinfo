"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DatabaseZap, Home, LineChart, PanelLeft } from "lucide-react";

import { sections } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavSheet() {
  const path = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <SheetTrigger asChild>
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <DatabaseZap className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">datahub.vofo.no</span>
            </Link>
          </SheetTrigger>
          <SheetTrigger asChild>
            <Link
              href="/"
              className={cn(
                "flex items-center gap-4 px-2.5  hover:text-foreground",
                path === "/" ? "" : "text-muted-foreground",
              )}
            >
              <Home className="h-5 w-5" />
              Dashbord
            </Link>
          </SheetTrigger>
          {sections.map((item) => (
            <SheetTrigger key={`sheet:nav:${item.url}`} asChild>
              <Link
                href={item.url}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-foreground",
                  path.startsWith(item.url) ? "" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </SheetTrigger>
          ))}
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
