'use client';

import { useEffect, useState } from 'react';
import AboutContent from '@/components/windows/aboutContent';

export default function AboutClient() {
  const [bio, setBio] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setBio(data?.bio ?? null));
  }, []);

  if (!bio) return <p className="p-4 text-sm"></p>;

  return <AboutContent bio={bio} />;
}
