export function Article({ children }: React.PropsWithChildren) {
  return (
    <article className="prose mt-2 mb-12 w-full prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h1:font-normal prose-h1:first:mt-0 prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg">
      {children}
    </article>
  );
}
