'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';
import styles from '@/styles/archive/search.module.css';

type SearchProps = {
    placeholder?: string;
};

export default function ArchiveSearch({ placeholder }: SearchProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Use debounce to avoid hitting  database on every keystroke
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        // Reset to page 1 when the query changes
        params.set('page', '1');

        if (term) {
            params.set('query', term);
            // remove any category or tag filter when you type
            params.delete('category');
            params.delete('tag');
        } else {
            params.delete('query');
        }
        // Replace current URL with updated query params
        router.replace(`${pathname}?${params.toString()}`);
    }, 100);

    return (
        <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={15} />
            <input
                type="text"
                defaultValue={searchParams.get('query') || ''}
                placeholder={placeholder || 'Type to search'}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                className={styles.searchInput}
            />
        </div>
    );
}
