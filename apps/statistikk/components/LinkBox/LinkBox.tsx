import Link from "next/link";

import WhiteBox from "@/components/Containers/WhiteBox";

interface PropTypes {
  url: string;
  title: string;
}

export const LinkBox = ({ url, title }: PropTypes) => (
  <WhiteBox key={url} noPadding>
    <Link
      href={url}
      className="w-full h-[100px] flex justify-center items-center no-underline text-2xl"
    >
      <span>{title}</span>
    </Link>
  </WhiteBox>
);
