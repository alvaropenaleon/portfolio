'use client';
import { useDebouncedCallback } from 'use-debounce';
import { Search } from 'lucide-react';
import styles from '@/styles/archive/search.module.css';
import { useEffect, useState, useCallback } from 'react';
import { useWindowNav } from '@/hooks/useWindowNav';

type SearchProps = {
  placeholder?: string;
};

export default function ArchiveSearch({ placeholder }: SearchProps) {
  const { params, replaceParams } = useWindowNav('archive');
  const currentProject = params.get('project') || undefined;
  
  const currentQuery = params.get('query') || '';
  const [inputValue, setInputValue] = useState(currentQuery);
  

  // Reset input when params are cleared externally (e.g., switching tabs, closing window)
  useEffect(() => {
    const urlQuery = params.get('query') || '';
    // Only update if there's a significant difference to avoid unnecessary re-renders
    if (inputValue !== urlQuery) {
      setInputValue(urlQuery);
    }
  }, [params, inputValue]);

  const applySearch = useCallback(
    (term: string) => {
      const trimmedTerm = term.trim();
      if (trimmedTerm) {
        replaceParams({
          query: trimmedTerm,
          category: undefined,
          tag: undefined,
          page: '1',
          project: currentProject,
        });
      } else {
        replaceParams({
          query: undefined,
          category: undefined,
          tag: undefined,
          page: '1',
          project: currentProject,
        });
      }
    },
    [replaceParams, currentProject]
  );

  const debouncedApply = useDebouncedCallback((term: string) => {
    applySearch(term);
  }, 150);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedApply(value);
  };

  const handleClear = () => {
    setInputValue('');
    // Clear immediately without debouncing
    replaceParams({
      query: undefined,
      category: undefined,
      tag: undefined,
      page: '1',
      project: currentProject,
    });
  };

  return (
    <div className={styles.searchContainer}>
      <Search className={styles.searchIcon} size={15} />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className={styles.searchInput}
        aria-label="Archive search"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}