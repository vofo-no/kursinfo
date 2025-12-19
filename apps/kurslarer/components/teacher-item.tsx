"use client";

import React from "react";
import { ChevronRightIcon } from "lucide-react";

import { formatList } from "@/lib/format-list";
import { formatNumber } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

export interface TeacherData {
  id: string;
  name: string;
  courses: {
    id: string;
    name: string;
    date: string;
    organizer: string;
    curriculum: string;
    county: string;
  }[];
  studieplans?: string[];
}
export function TeacherItem({
  data,
  index,
}: {
  data: TeacherData;
  index: number;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment key={data.id}>
      {index !== 0 && <ItemSeparator />}
      <Collapsible open={open} onOpenChange={setOpen}>
        <Item>
          <ItemContent className="gap-1">
            <ItemTitle>
              <CollapsibleTrigger asChild>
                <Button variant="secondary" size="sm" className="text-sm">
                  <ChevronRightIcon
                    className={cn("transition-transform", open && "rotate-90")}
                  />
                  {formatNumber(data.courses.length)} kurs
                </Button>
              </CollapsibleTrigger>
              {data.name}
            </ItemTitle>
            <ItemDescription>
              <span className="text-sm text-muted-foreground">
                {formatList(data.studieplans || [])}
              </span>
            </ItemDescription>
            <CollapsibleContent>
              <ul>
                {data.courses.map((course) => (
                  <li key={course.id} className="flex gap-4 mt-2">
                    <Badge variant="secondary">
                      {new Date(course.date).toLocaleDateString("no", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Badge>
                    <strong>{course.name}</strong>
                    <span className="text-sm text-muted-foreground">
                      {course.organizer}
                      {course.curriculum && ` • ${course.curriculum}`}
                      {course.county && ` • ${course.county}`}
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </ItemContent>
        </Item>
      </Collapsible>
    </React.Fragment>
  );
}
