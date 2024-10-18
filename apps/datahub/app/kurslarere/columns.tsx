"use client";

import { ColumnDef, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Teacher } from "../types";

const currentYear = new Date().getFullYear();

function getSortableColumn(label: string) {
  const sortableColumn = ({ column }: HeaderContext<Teacher, unknown>) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };
  return sortableColumn;
}

export const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "name",
    header: getSortableColumn("Navn"),
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "yearOfBirth",
    header: getSortableColumn("Alder"),
    cell: ({ row }) => {
      return currentYear - Number(row.getValue("yearOfBirth"));
    },
  },
  {
    accessorKey: "gender",
    header: "Kjønn",
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
  { accessorKey: "emailAddress", header: "E-postadresse" },
  { accessorKey: "phoneNumber", header: "Telefonnummer" },
  {
    accessorKey: "courses",
    header: "Kurs",
    cell: ({ row }) => {
      const values = row.getValue<string[]>("courses");
      const id = row.original.id;

      return (
        <div className="flex flex-wrap gap-1">
          {values.map((courseId) => (
            <Badge variant="outline" key={[id, courseId].join(":")}>
              {courseId}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
