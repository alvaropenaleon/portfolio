// components/archive/sidebar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/styles/archive/sidebar.module.css";
// import CategoryColorDot from '@/components/ui/categoryMapping';
import { FolderClosed } from 'lucide-react';
import clsx from 'clsx';


interface Props {
  categories: string[];
  activeCategory: string;
}

export default function CategorySidebar({
  categories,
  activeCategory,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function go(cat?: string) {
    const params = new URLSearchParams(sp.toString());
    params.set("page", "1");
    if (cat) params.set("category", cat);
    else    params.delete("category");

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div>

      <ul className={styles.list}>
      <h3 className={styles.title}>Favourites</h3>
        <li
          className={clsx(styles.favItem, !activeCategory ? styles.active : "")}
          onClick={() => go()}
        >
        <FolderClosed className={styles.folderIcon} size={15} />
        Archive
        </li>
        {categories.map((cat) => (
          <li
            key={cat}
            className={clsx(styles.catItem, activeCategory === cat ? styles.active : '')}
            onClick={() => go(cat)}
          >
            <FolderClosed  className={styles.folderIcon} size={15} />
            {cat}
          </li>
        ))}
      </ul>
      <h3 className={styles.title}>Tags</h3>

    </div>
  );
}
