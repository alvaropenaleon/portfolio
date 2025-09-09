// components/windows/imageContent.tsx
'use client';

import Image from 'next/image';

export default function ImageWindow({ payload }: { payload: { src: string; title?: string } }) {
  const { src, title } = payload || {};
  if (!src) return <div style={{ padding: 12 }}>No image</div>;

  return (
    <div
      style={{
        position: 'relative',  // required for fill
        width: '100%',
        height: '100%',        // the parent must have height
        background: 'rgb(var(--color-foreground-rgb), 0.45)',
      }}
    >
      <Image
        src={src}
        alt={title ?? 'Image'}
        fill                     // ← no width/height needed
        sizes="100vw"            // hint for responsive loading
        priority                 // optional: load ASAP
        style={{ objectFit: 'contain', userSelect: 'none' }}
        draggable={false}
      />
    </div>
  );
}
