'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import React from 'react';

type SearchProps = {
  placeholder?: string;
};

export default function ArchiveSearch({ placeholder }: SearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // We'll debounce to avoid hitting the DB on every keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Reset to page 1 whenever the query changes
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Replace the current URL but with updated query params
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="my-4">
      <input
        type="text"
        defaultValue={searchParams.get('query') || ''}
        placeholder={placeholder || 'Search...'}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        className="border px-2 py-1 rounded"
      />
    </div>
  );
}
