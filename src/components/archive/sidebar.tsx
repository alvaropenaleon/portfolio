// components/archive/sidebar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/styles/archive/sidebar.module.css";

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

      <h3 className={styles.title}>Categories</h3>

      <ul className={styles.list}>
        <li
          className={!activeCategory ? styles.active : ""}
          onClick={() => go()}
        >
          All Work
        </li>
        {categories.map((cat) => (
          <li
            key={cat}
            className={activeCategory === cat ? styles.active : ""}
            onClick={() => go(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}
