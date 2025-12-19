import Image from "next/image";

import { TypographyH1 } from "@/components/ui/typography";

import constructionImage from "./undraw_under_construction.svg";

export default function SfPage() {
  return (
    <>
      <TypographyH1>Oversikt</TypographyH1>
      <div className="mx-auto max-w-96">
        <Image src={constructionImage} alt="Under construction" />
        <p className="my-4 text-center text-lg text-muted-foreground">
          Her kan vi bygge noe fint en gang ...
        </p>
      </div>
    </>
  );
}
