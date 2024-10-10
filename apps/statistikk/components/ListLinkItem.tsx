import Link from "next/link";

export default function ListLinkItem({
  url,
  title,
  bold = false,
}: {
  url: string;
  title: string;
  bold?: boolean;
}) {
  return (
    <Link href={url} className="no-underline">
      <span
        className={`block px-2 tablet:px-6 py-2 ${bold ? "font-bold" : ""}`}
      >
        {title}
      </span>
    </Link>
  );
}
