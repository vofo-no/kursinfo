"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { formatList } from "@/lib/format-list";
import { formatNumber } from "@/lib/format-number";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./ui/item";

export interface TeacherData {
  id: string;
  name: string;
  avatar: string;
  courses: number;
  studieplans?: string[];
}
export function TeacherItem({
  data,
  index,
}: {
  data: TeacherData;
  index: number;
}) {
  const { sf } = useParams();
  return (
    <React.Fragment key={data.id}>
      {index !== 0 && <ItemSeparator />}
      <Item asChild>
        <Link href={`/${sf}/larer/${data.id}`}>
          <ItemMedia>
            <Avatar>
              <AvatarImage src={data.avatar} />
              <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle className="line-clamp-1">
              {data.name} -{" "}
              <span className="text-muted-foreground">
                {formatNumber(data.courses)} kurs
              </span>
            </ItemTitle>
            <ItemDescription>
              {formatList(data.studieplans || [])}
            </ItemDescription>
          </ItemContent>
        </Link>
      </Item>
    </React.Fragment>
  );
}
