// components/archive/sidebar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/styles/archive/sidebar.module.css";
// import CategoryColorDot from '@/components/ui/categoryMapping';
import { FolderClosed, Settings } from 'lucide-react';
import { TagDot, sortTagsByColor } from "@/components/ui/tag";
import clsx from 'clsx';


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
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function go(category?: string, tag?: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("page", "1");
    
    if (category) { params.set('category', category); params.delete('tag'); }
    else if (tag) { params.set('tag', tag); params.delete('category'); }
    else { params.delete('category'); params.delete('tag'); }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <ul className={styles.list}>
      {/* Favourites */}
      <h3 className={styles.title}>Favourites</h3>
      <li
          className={clsx(styles.favItem, !activeCategory ? styles.active : "")}
          onClick={() => go()}
      >
        <FolderClosed size={15}  strokeWidth={1.6} className={styles.folderIcon} />
        Archive
      </li>

      {/* Categories  
      <h3 className={styles.title}>Categories</h3> */}
      {categories
        .filter(cat => cat == 'Design')   // only render work category
        .map((category) => (
        <li
          key={category}
          className={clsx(styles.catItem, activeCategory === category ? styles.active : '')}
          onClick={() => go(category)}
        >
          <Settings size={15} strokeWidth={1.6} className={styles.folderIcon} />
          {category}
        </li>
      ))} 

      {/* Tags */}
      <h3 className={styles.title}>Tags</h3>
      {sortTagsByColor(tags).map((tag) => (
        <li
          key={tag}
          className={clsx(styles.tagItem, activeTag === tag ? styles.active : "")}
          onClick={() => go(undefined, tag)}
        >
          <TagDot tag={tag} />
          {tag}
        </li>
      ))}
    </ul>
  );
}
