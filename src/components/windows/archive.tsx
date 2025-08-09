'use client';
import { useEffect, useRef, useMemo, useState } from 'react';
import type { Project } from '@/lib/definitions';
import ArchiveContent from '@/components/windows/archiveContent';
import { useWindowStore } from '@/store/windowStore';
import { useWindowNav } from '@/hooks/useWindowNav';

type ArchiveResponse = {
  projects: Project[];
  totalPages: number;
  categories: string[];
  tags: string[];
};

type FilterSet = {
  query: string;
  category: string;
  tag: string;
  page: string;
};

/**
 * Applies precedence query > tag > category to raw URL + stored payload
 */
function deriveFilters(
  rawQuery: string,
  rawCategory: string,
  rawTag: string,
  stored?: { query: string; category: string; tag: string }
): { query: string; category: string; tag: string } {
  const query = rawQuery;
  const tag = query ? '' : rawTag;
  const category = query || tag ? (tag ? '' : rawCategory) : rawCategory;
  
  // Only use stored values if there are no URL parameters
  const hasUrlParams = rawQuery || rawCategory || rawTag;
  
  const effectiveQuery = query || (!hasUrlParams && stored?.query) || '';
  const effectiveTag = tag || (!hasUrlParams && !query && stored?.tag) || '';
  const effectiveCategory = category || (!hasUrlParams && !query && !tag && stored?.category) || '';
  
  return {
    query: effectiveQuery,
    category: effectiveCategory,
    tag: effectiveTag,
  };
}

export default function ArchiveClientWrapper() {
  const { wins, setPayload } = useWindowStore();
  const { params } = useWindowNav('archive');
  
  const archiveWindow = wins.archive;
  const storedPayload = archiveWindow?.payload as
    | (ArchiveResponse & { query: string; category: string; tag: string })
    | undefined;

  // raw from window params
  const rawQuery = params.get('query') ?? '';
  const rawCategory = params.get('category') ?? '';
  const rawTag = params.get('tag') ?? '';
  const page = params.get('page') ?? '1';

  // derive normalized filters
  const { query, category, tag } = deriveFilters(
    rawQuery,
    rawCategory,
    rawTag,
    storedPayload
  );

  const normFilters: FilterSet = {
    query,
    category,
    tag,
    page,
  };

  // track last applied authoritative filter (what data corresponds to)
  const [lastApplied, setLastApplied] = useState({
    query: '',
    category: '',
    tag: '',
    page: '1',
  });

  // authoritative data from last successful fetch
  const [authoritative, setAuthoritative] = useState<ArchiveResponse | null>(null);

  // Keep an unfiltered last full snapshot to derive immediate filtering
  const lastFullSnapshotRef = useRef<ArchiveResponse | null>(null);

  // Reset state when window reopens without stored payload
  useEffect(() => {
    if (archiveWindow?.open && !storedPayload) {
      setLastApplied({
        query: '',
        category: '',
        tag: '',
        page: '1',
      });
      setAuthoritative(null);
      lastFullSnapshotRef.current = null;
    }
  }, [archiveWindow?.open, storedPayload]);

  // Initialize from stored payload if available
  useEffect(() => {
    if (storedPayload && !authoritative) {
      setAuthoritative({
        projects: storedPayload.projects,
        totalPages: storedPayload.totalPages,
        categories: storedPayload.categories,
        tags: storedPayload.tags,
      });
      setLastApplied({
        query: storedPayload.query || '',
        category: storedPayload.category || '',
        tag: storedPayload.tag || '',
        page: '1',
      });
    }
  }, [storedPayload, authoritative]);

  // update last full snapshot when appropriate
  useEffect(() => {
    if (!authoritative) return;
    const isBase =
      lastApplied.query === '' &&
      lastApplied.tag === '' &&
      lastApplied.category === '';
    if (isBase || !lastFullSnapshotRef.current) {
      lastFullSnapshotRef.current = authoritative;
    }
  }, [authoritative, lastApplied]);

  // Build the canonical URL string based on precedence
  const buildCanonicalSearch = (): string => {
    const params = new URLSearchParams();
    if (normFilters.query) {
      params.set('query', normFilters.query);
    } else if (normFilters.tag) {
      params.set('tag', normFilters.tag);
    } else if (normFilters.category) {
      params.set('category', normFilters.category);
    }
    if (normFilters.page && normFilters.page !== '1') {
      params.set('page', normFilters.page);
    }
    return params.toString();
  };

  // effect: fetch authoritative data when filters change
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    const canonicalSearch = buildCanonicalSearch();
    
    // Check if we need to fetch
    if (
      normFilters.query === lastApplied.query &&
      normFilters.category === lastApplied.category &&
      normFilters.tag === lastApplied.tag &&
      normFilters.page === lastApplied.page &&
      authoritative
    ) {
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const ac = new AbortController();
    abortRef.current = ac;

    fetch(`/api/archive?${canonicalSearch}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((fetched: ArchiveResponse) => {
        if (ac.signal.aborted) return;
        setAuthoritative(fetched);
        setLastApplied(normFilters);
        
        setPayload('archive', {
          projects: fetched.projects,
          totalPages: fetched.totalPages,
          categories: fetched.categories,
          tags: fetched.tags,
          query: normFilters.query,
          category: normFilters.category,
          tag: normFilters.tag,
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Archive fetch error', err);
      });
  }, [
    normFilters.query,
    normFilters.category,
    normFilters.tag,
    normFilters.page,
    lastApplied.query,
    lastApplied.category,
    lastApplied.tag,
    lastApplied.page,
    authoritative,
    setPayload,
    buildCanonicalSearch
  ]);

  // Derive visible data without flash: authoritative if matching, else locally filtered snapshot
  const visibleData: ArchiveResponse | null = useMemo(() => {
    if (!authoritative && !lastFullSnapshotRef.current) return null;
    const base = lastFullSnapshotRef.current || authoritative!;

    const matchesAuthoritative =
      lastApplied.query === normFilters.query &&
      lastApplied.category === normFilters.category &&
      lastApplied.tag === normFilters.tag &&
      lastApplied.page === normFilters.page &&
      authoritative;

    if (matchesAuthoritative && authoritative) {
      return authoritative;
    }

    let filtered = base.projects;
    if (normFilters.query) {
      const term = normFilters.query.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    } else if (normFilters.tag) {
      filtered = filtered.filter((p) => p.tags.includes(normFilters.tag));
    } else if (normFilters.category) {
      filtered = filtered.filter((p) =>
        p.categories.includes(normFilters.category)
      );
    }

    return {
      projects: filtered,
      totalPages: base.totalPages,
      categories: base.categories,
      tags: base.tags,
    };
  }, [authoritative, lastApplied, normFilters]);

  if (!visibleData) {
    return <div>Initializing archive...</div>;
  }

  return (
    <ArchiveContent
      projects={visibleData.projects}
      totalPages={visibleData.totalPages}
      categories={visibleData.categories}
      tags={visibleData.tags}
      query={normFilters.query}
      category={normFilters.category}
      tag={normFilters.tag}
    />
  );
}