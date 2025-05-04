// components/about/Bio.tsx
"use client";

import ReactMarkdown from "react-markdown";

type Props = { markdown: string };

export default function Bio({ markdown }: Props) {
  return (
      <ReactMarkdown>{markdown}</ReactMarkdown>
  );
}
