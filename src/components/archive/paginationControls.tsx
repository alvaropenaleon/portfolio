// /components/archive/PaginationControls.tsx
import Link from 'next/link';

type PaginationControlsProps = {
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
};

export default function PaginationControls({
  searchQuery,
  selectedCategory,
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
        const isActive = pageNumber === currentPage;
        const queryParams = new URLSearchParams({
          search: searchQuery,
          category: selectedCategory,
          page: pageNumber.toString(),
        });
        return (
          <Link
            key={pageNumber}
            href={`?${queryParams.toString()}`}
            className={`px-3 py-1 border ${isActive ? 'bg-gray-200' : ''}`}
          >
            {pageNumber}
          </Link>
        );
      })}
    </div>
  );
}
