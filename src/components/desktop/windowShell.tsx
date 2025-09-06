'use client';
import React, { useEffect } from 'react';
import type { WindowID, WorkPayload } from '@/lib/definitions';
import type { WindowPayloads } from '@/lib/definitions';
import AboutContent from '@/components/windows/aboutContent';
import ArchiveClientWrapper from '@/components/windows/archive';
import WorkWindow from '@/components/windows/work';
import { useWindowStore } from '@/store/windowStore';
import { useWindowNav } from '@/hooks/useWindowNav';

type Props = {
  id: WindowID;
  payload?: WindowPayloads[WindowID];
};

function prettify(val: string) {
  return val.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function capitalize(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

function WindowShell({ id, payload }: Props) {
  const { setTitle, wins } = useWindowStore();
  const { params } = useWindowNav(id);

  // SMOKE / debug
  console.log('[SMOKE TEST] WindowShell render', { id, payload });

  // derive title synchronously
  let computedTitle: string;
  if (id === 'archive') {
    const q = params.get('query') ?? '';
    const cat = params.get('category') ?? '';
    const tag = params.get('tag') ?? '';
    if (q) computedTitle = `Searching "${q}"`;
    else if (cat) computedTitle = prettify(cat);
    else if (tag) computedTitle = prettify(tag);
    else computedTitle = 'Archive';
  } else if (id === 'about') {
    computedTitle = 'About';
  } else if (id === 'work') {
    computedTitle = 'Work';
  } else {
    computedTitle = capitalize(id as string);
  }

  // only update store if title actually changes
  useEffect(() => {
    const current = wins[id]?.title;
    if (current !== computedTitle) {
      setTitle(id, computedTitle);
    }
  }, [id, computedTitle, setTitle, wins]);

  if (id === 'about' && payload) {
    return <AboutContent bio={(payload as { bio: string }).bio} />;
  }

  if (id === 'archive') {
    return <ArchiveClientWrapper />;
  }

  if (id === 'work') {
    return <WorkWindow payload={payload as WorkPayload} />;
  }

  return <div>Loading...</div>;
}

const propsAreEqual = (prev: Props, next: Props) => {
  return (
    prev.id === next.id &&
    JSON.stringify(prev.payload) === JSON.stringify(next.payload)
  );
};

export default React.memo(WindowShell, propsAreEqual);