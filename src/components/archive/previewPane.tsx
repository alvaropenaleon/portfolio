"use client";

import React from "react";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/previewPane.module.css";

interface PreviewPaneProps {
  project: Project;
  onClose: () => void;
}

export default function PreviewPane({ project, onClose }: PreviewPaneProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2>{project.title}</h2>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
      </div>
      <div className={styles.content}>
        <p>{project.description}</p>
        {/* Add more project details as needed */}
      </div>
    </aside>
  );
}