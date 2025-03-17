'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from '@/styles/archive/pagination.module.css';
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    totalPages: number;
};

export default function ArchivePagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Current URL oage
    const currentPage = Number(searchParams.get('page')) || 1;

    // URL builder for a given page
    function createPageURL(pageNumber: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(pageNumber));
        return `${pathname}?${params.toString()}`;
    }

    //Hide pagination
    // if (totalPages <= 1) return null;

    return (
        <nav className={styles.nav}>
            {/* Previous Page button */}
            {currentPage > 1 && (
                <Link href={createPageURL(currentPage - 1)}>
                    <span className={styles.link}>
                        <ChevronLeft size={16} />
                    </span>
                </Link>
            )}

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link key={pageNum} href={createPageURL(pageNum)}>
                    <span
                        className={
                            pageNum === currentPage
                                ? `${styles.link} ${styles.active}`
                                : styles.link
                        }
                    >
                        {pageNum}
                    </span>
                </Link>
            ))}

            {/* Next Page button */}
            {currentPage < totalPages && (
                <Link href={createPageURL(currentPage + 1)}>
                    <span className={styles.link}>
                        <ChevronRight size={16} />
                    </span>
                </Link>
            )}
        </nav>
    );
}