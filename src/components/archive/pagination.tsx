'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from '@/styles/archive/pagination.module.css';

type PaginationProps = {
  totalPages: number;
};

export default function ArchivePagination({ totalPages }: PaginationProps) {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const page         = Number(searchParams.get('page')) || 1;

  /* helper to rebuild ?page= */
  const urlFor = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    return `${pathname}?${params}`;
  };

  const atStart = page === 1;
  const atEnd   = page === totalPages;

  return (
    <nav className={styles.nav}>
      {/* previous */}
      {atStart ? (
        <span className={`${styles.link} ${styles.disabled}`}>
          <ChevronLeft size={16} />
        </span>
      ) : (
        <Link href={urlFor(page - 1)} className={styles.link}>
          <ChevronLeft size={16} />
        </Link>
      )}

      {/* current page */}
      <span className={`${styles.link} ${styles.active}`}>{page}</span>

      {/* next */}
      {atEnd ? (
        <span className={`${styles.link} ${styles.disabled}`}>
          <ChevronRight size={16} />
        </span>
      ) : (
        <Link href={urlFor(page + 1)} className={styles.link}>
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
