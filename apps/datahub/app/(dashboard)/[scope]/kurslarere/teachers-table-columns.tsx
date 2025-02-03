"use client";

import { ColumnDef, HeaderContext } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MailIcon,
  MinusIcon,
  PhoneIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Teacher } from "@/app/types";

const currentYear = new Date().getFullYear();

function getSortableColumn(label: string, className?: string) {
  const sortableColumn = ({ column }: HeaderContext<Teacher, unknown>) => {
    const sortDirection = column.getIsSorted();
    const SortIcon =
      (sortDirection && { asc: ArrowUp, desc: ArrowDown }[sortDirection]) ||
      ArrowUpDown;
    return (
      <span className={cn("flex justify-between items-center", className)}>
        {label}
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <SortIcon className="h-4 w-4" />
        </Button>
      </span>
    );
  };
  return sortableColumn;
}

export const teachersTableColumns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "name",
    header: getSortableColumn("Navn", "ml-3"),
    cell: ({ row }) => (
      <span className="font-semibold ml-3 inline-block">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    id: "yearOfBirth",
    accessorFn: (row) => currentYear - row.yearOfBirth || 0,
    header: getSortableColumn("Alder"),
  },
  {
    accessorKey: "gender",
    header: "Kjønn",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("gender");
      if (value === "Male")
        return (
          <Badge variant="outline" className="text-blue-600 bg-blue-100">
            Mann
          </Badge>
        );
      if (value === "Female")
        return (
          <Badge variant="outline" className="text-pink-600 bg-pink-100">
            Kvinne
          </Badge>
        );
      return value;
    },
  },
  {
    accessorKey: "zip",
    header: getSortableColumn("Postnummer"),
  },
  {
    accessorKey: "emailAddress",
    header: () => <span className="sr-only">E-postadresse</span>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("emailAddress");
      if (typeof value === "string" && value)
        return (
          <HoverCard>
            <HoverCardTrigger>
              <a href={`mailto:${value}`}>
                <MailIcon className="size-4" />
                <span className="sr-only">{value}</span>
              </a>
            </HoverCardTrigger>
            <HoverCardContent>{value}</HoverCardContent>
          </HoverCard>
        );
      return <MinusIcon className="size-4 opacity-20" />;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <span className="sr-only">Telefonnummer</span>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const value = row.getValue("phoneNumber");
      if (typeof value === "string" && value)
        return (
          <HoverCard>
            <HoverCardTrigger>
              <a href={`tel:${value}`}>
                <PhoneIcon className="size-4" />
                <span className="sr-only">{value}</span>
              </a>
            </HoverCardTrigger>
            <HoverCardContent>{value}</HoverCardContent>
          </HoverCard>
        );
      return <MinusIcon className="size-4 opacity-20" />;
    },
  },
  {
    id: "subjects",
    accessorFn: (row) => row.subjects?.join("\n"),
    header: "Studieplaner",
    cell: ({ row }) => {
      const values = row.getValue<string | undefined>("subjects")?.split("\n");
      const id = row.original.id;

      return (
        <div className="flex flex-wrap gap-1">
          {values?.map((subject) => (
            <Badge variant="outline" key={[id, subject].join(":")}>
              {subject}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "courses",
    accessorFn: (row) => row.courses?.join("\n"),
    header: "Kurs",
    cell: ({ row }) => {
      const values = row.getValue<string | undefined>("courses")?.split("\n");
      const id = row.original.id;

      return (
        <div className="flex flex-wrap gap-1">
          {values?.map((courseId) => (
            <Badge variant="outline" key={[id, courseId].join(":")}>
              {courseId}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
