// src/components/ui/markdown.tsx
'use client';

import React, { JSX } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema, type Schema } from 'hast-util-sanitize';
import styles from '@/styles/ui/markdown.module.css';

type Props = { content?: string | null };

/* ---------- typed helpers ---------- */
type RendererOf<K extends keyof Components> =
  Exclude<Components[K], keyof JSX.IntrinsicElements | string | undefined>;
type PropsOf<T> = T extends (props: infer P) => unknown ? P : never;
type CodeProps = PropsOf<RendererOf<'code'>>;

const clone = <T,>(obj: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(obj)
    : (JSON.parse(JSON.stringify(obj)) as T);

/* ---------- safe URL helpers (used in components) ---------- */
function safeHref(href?: string) {
  if (!href) return undefined;
  try {
    const u = new URL(href, 'http://x');
    const ok = /^(https?:|mailto:|tel:)$/i.test(u.protocol);
    return ok ? href : undefined;
  } catch {
    return undefined;
  }
}

function safeSrc(src?: string) {
  if (!src) return undefined;
  try {
    const u = new URL(src, 'http://x');
    const ok = /^(https?:)$/i.test(u.protocol);
    return ok ? src : undefined;
  } catch {
    return undefined;
  }
}

/* ---------- code renderer (typed) ---------- */
function CodeRenderer(props: CodeProps) {
  const { inline, className, children, ...rest } = props as CodeProps & { inline?: boolean };
  return inline ? (
    <code className={`${styles.codeInline} ${className ?? ''}`} {...rest}>
      {children}
    </code>
  ) : (
    <pre className={styles.codeBlock}>
      <code className={className ?? ''} {...rest}>
        {children}
      </code>
    </pre>
  );
}

/* ---------- custom components ---------- */
const components: Components = {
  a: (p) => (
    <a
      {...p}
      href={safeHref(typeof p.href === 'string' ? p.href : undefined)}
      target="_blank"
      rel="noopener noreferrer"
    />
  ),

  // eslint-disable-next-line @next/next/no-img-element
  img: (p) => (
    <img
      {...p}
      src={safeSrc(typeof p.src === 'string' ? p.src : undefined)}
      alt={p.alt ?? ''}
      loading="lazy"
    />
  ),

  // presentational-only task checkboxes
  input: (p) => (p.type === 'checkbox' ? <input {...p} disabled /> : null),

  code: CodeRenderer,
  hr: () => <hr className={styles.rule} />,
};

/* ---------- strictly typed sanitize schema ---------- */
const schema: Schema = (() => {
  const s = clone<Schema>(defaultSchema);

  // allow GFM checkboxes
  s.tagNames = Array.from(new Set([...(s.tagNames ?? []), 'input']));

  // keep highlight classes + safe attrs
  s.attributes = {
    ...s.attributes,
    code: [...(s.attributes?.code ?? []), ['className']],
    pre:  [...(s.attributes?.pre  ?? []), ['className']],
    a:    [...(s.attributes?.a    ?? []), ['href'], ['target'], ['rel']],
    img:  [...(s.attributes?.img  ?? []), ['src'], ['alt'], ['loading']],
    input: [
      ['type', 'checkbox'],
      ['checked', true],
      ['disabled', true],
    ],
  };

  // protocol allow-list (extra guard)
  s.protocols = {
    ...(s.protocols ?? {}),
    href: ['http', 'https', 'mailto', 'tel'],
    src:  ['http', 'https'],
  };

  return s;
})();

/* ---------- component ---------- */
export default function Markdown({ content }: Props) {
  if (!content) return null;

  return (
    <article className={styles.bear}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeSanitize, schema],
          rehypeHighlight,
        ]}
        components={components}
        /* transformLinkUri / transformImageUri were removed in v9 types — we enforce safety via components + schema */
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
