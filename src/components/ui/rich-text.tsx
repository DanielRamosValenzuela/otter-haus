import type { ReactNode } from "react";

const INLINE = /\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|\*([\s\S]+?)\*/;

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;

  for (let match = INLINE.exec(rest); match; match = INLINE.exec(rest)) {
    if (match.index > 0) nodes.push(rest.slice(0, match.index));
    const [full, bold, underline, italic] = match;
    if (bold !== undefined) nodes.push(<strong key={key++}>{parseInline(bold)}</strong>);
    else if (underline !== undefined) nodes.push(<u key={key++}>{parseInline(underline)}</u>);
    else nodes.push(<em key={key++}>{parseInline(italic)}</em>);
    rest = rest.slice(match.index + full.length);
  }

  if (rest) nodes.push(rest);
  return nodes;
}

export function normalizeNewlines(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

export function RichInline({ text }: { text: string }) {
  return <>{parseInline(text)}</>;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = normalizeNewlines(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          <RichInline text={paragraph} />
        </p>
      ))}
    </div>
  );
}
