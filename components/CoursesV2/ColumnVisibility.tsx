"use client";

import { Column } from "@tanstack/react-table";
import AlertDialog from "components/AlertDialog";
import { useState } from "react";
import { Settings as SettingsIcon } from "react-feather";

import { getColumnName } from "./helpers/getColumnName";

interface ColumnVisibilityProps {
  columns: Column<any, unknown>[];
}

function ColumnVisibility({ columns }: ColumnVisibilityProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="py-2 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-darker focus:z-10 focus:border-crimson-300 focus:ring focus:ring-crimson-200 focus:ring-opacity-50 print:hidden"
        type="button"
        onClick={() => setOpen(true)}
        title="Velg kolonner"
      >
        <SettingsIcon size={16} className="inline" />
      </button>
      <AlertDialog
        title="Velg kolonner"
        open={open}
        close={() => setOpen(false)}
      >
        {columns.map((column) => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{" "}
                {column.parent?.id === "planned" && "Planlagte "}
                {getColumnName(column.columnDef.header) || column.id}
              </label>
            </div>
          );
        })}
      </AlertDialog>
    </>
  );
}

export default ColumnVisibility;
