import LinkBox from "@/components/LinkBox";

interface PropTypes {
  items: Array<[string, string]>;
}

export const GridLinks = ({ items }: PropTypes) => (
  <div className="grid grid-cols-2 tablet:grid-cols-3 gap-4 my-4">
    {items.map(([url, title]) => (
      <LinkBox key={url} url={url} title={title} />
    ))}
  </div>
);
