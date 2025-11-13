"use client";
import styles from "@/styles/archive/sidebar.module.css";
import { FolderClosed, FolderOpen, Settings } from 'lucide-react';
import { TagDot, sortTagsByColor } from "@/components/ui/tag";
import clsx from 'clsx';
import { useWindowNav } from '@/hooks/useWindowNav';

interface Props {
  categories: string[];
  tags: string[];
  activeCategory: string;
  activeTag: string;
}

export default function CategorySidebar({
  categories,
  tags,
  activeCategory,
  activeTag,
}: Props) {
  const { replaceParams, params } = useWindowNav('archive');
  const currentProject = params.get('project') || undefined;


  function go(category?: string, tag?: string) {
    if (category) {
      replaceParams({
        category,
        tag: undefined,
        query: undefined,
        page: '1',
        project: currentProject,
      });
    } else if (tag) {
      replaceParams({
        tag,
        category: undefined,
        query: undefined,
        page: '1',
        project: currentProject,
      });
    } else {
      // Going to root archive - clear all filters
      replaceParams({
        category: undefined,
        tag: undefined,
        query: undefined,
        page: '1',
        project: currentProject,
      });
    }
  }

  // Check if we're in the root archive view (no filters)
  const isRootView = !activeCategory && !activeTag;
  
  return (
    <ul className={styles.list}>
      {/* Favourites */}
      <h3 className={styles.title}>Favourites</h3>
      <li
        className={clsx(styles.favItem, isRootView && styles.active)}
        onClick={() => go()}
      >
        {isRootView ? (
          <FolderOpen
            size={15}
            strokeWidth={1.6}
            className={styles.folderIcon}
          />
        ) : (
          <FolderClosed
            size={15}
            strokeWidth={1.6}
            className={styles.folderIcon}
          />
        )}
        Archive
      </li>
      
      {/* Categories - Only show Work category */}
      {categories
        .filter(cat => cat === "Projects")
        .map((category) => (
          <li
            key={category}
            className={clsx(styles.catItem, activeCategory === category && styles.active)}
            onClick={() => go(category)}
          >
            <Settings size={15} strokeWidth={1.6} className={styles.folderIcon} />
            {category}
          </li>
        ))}
        
     {/* Categories show rest */}
     <h3 className={styles.title}>Categories</h3>
{categories
  .filter((cat) => cat !== "Projects")
  .map((category) => (
    <li
      key={category}
      className={clsx(styles.catItem, activeCategory === category && styles.active)}
      onClick={() => go(category)}
    >
      {activeCategory === category ? (
        <FolderOpen
          size={15}
          strokeWidth={1.6}
          className={styles.folderIcon}
        />
      ) : (
        <FolderClosed
          size={15}
          strokeWidth={1.6}
          className={styles.folderIcon}
        />
      )}
      {category}
    </li>
  ))}
      
      {/* Tags */}
      <h3 className={styles.title}>Tags</h3>
      {sortTagsByColor(tags).map((tag) => (
        <li
          key={tag}
          className={clsx(styles.tagItem, activeTag === tag && styles.active)}
          onClick={() => go(undefined, tag)}
        >
          <TagDot tag={tag} />
          {tag}
        </li>
      ))}
    </ul>
  );
}