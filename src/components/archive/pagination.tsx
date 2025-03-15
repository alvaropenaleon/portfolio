'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
};

export default function ArchivePagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Current page from the URL, or default 1
  const currentPage = Number(searchParams.get('page')) || 1;

  // Helper to build a URL for a given page
  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  }

  // If there's only 1 page, no need to render the pagination
  // if (totalPages <= 1) return null;

  return (
    <nav className="my-4 flex items-center justify-center gap-2">
      {/* Previous Page button */}
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)}>
          <span className="border px-2 py-1 rounded">&larr; Prev</span>
        </Link>
      )}

      {/* Show pages 1...N (you can get fancy with ellipses, etc.) */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link key={pageNum} href={createPageURL(pageNum)}>
          <span
            className={
              pageNum === currentPage
                ? 'border border-blue-500 px-2 py-1 rounded bg-blue-100'
                : 'border px-2 py-1 rounded'
            }
          >
            {pageNum}
          </span>
        </Link>
      ))}

      {/* Next Page button */}
      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)}>
          <span className="border px-2 py-1 rounded">Next &rarr;</span>
        </Link>
      )}
    </nav>
  );
}
