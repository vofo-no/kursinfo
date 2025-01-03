"use client";

import { DataTable } from "@/components/ui/data-table";
import { Teacher } from "@/app/types";

import { teachersTableColumns } from "./teachers-table-columns";
import { TeachersTableHeading } from "./teachers-table-heading";

interface TeachersTableProps {
  data: Teacher[];
}

export function TeachersTable({ data }: TeachersTableProps) {
  return (
    <DataTable
      columns={teachersTableColumns}
      data={data}
      Heading={TeachersTableHeading}
      className="col-span-full"
    />
  );
}
