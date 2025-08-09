'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/archive/pagination.module.css';
import { useWindowNav } from '@/hooks/useWindowNav';

type PaginationProps = {
  totalPages: number;
};

export default function ArchivePagination({ totalPages }: PaginationProps) {
  const { params, setParam } = useWindowNav('archive');
  const page = Number(params.get('page')) || 1;

  const atStart = page === 1;
  const atEnd = page === totalPages;

  const goToPage = (p: number) => {
    setParam('page', String(p));
  };

  return (
    <nav className={styles.nav}>
      {/* previous */}
      {atStart ? (
        <span className={`${styles.link} ${styles.disabled}`}>
          <ChevronLeft size={16} />
        </span>
      ) : (
        <button 
          onClick={() => goToPage(page - 1)} 
          className={styles.link}
        >
          <ChevronLeft size={16} />
        </button>
      )}
      {/* current page */}
      <span className={`${styles.link} ${styles.active}`}>{page}</span>
      {/* next */}
      {atEnd ? (
        <span className={`${styles.link} ${styles.disabled}`}>
          <ChevronRight size={16} />
        </span>
      ) : (
        <button 
          onClick={() => goToPage(page + 1)} 
          className={styles.link}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </nav>
  );
}