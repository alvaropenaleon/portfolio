"use client";

import React from "react";
import type { Project } from "@/lib/definitions";
import styles from "@/styles/archive/previewPane.module.css";
import Image from "next/image";

interface PreviewPaneProps {
  project: Project;
  onClose: () => void;
}

export default function PreviewPane({ project, onClose }: PreviewPaneProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h5 className={styles.headerTitle}>Preview Pane </h5>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.thumbnailWrapper}>
          <Image
            src={project.heroImage}
            alt={project.title}
            width={300}
            height={200}
            className={styles.thumbnail}
            quality={100}
          />
        </div>
        <h2 className={styles.title}>{project.title}</h2>
        <p>{project.description}</p>
        <p><strong>Date Added:</strong> {project.date}</p>
        <p><strong>Categories:</strong> {project.categories} </p>
        <p><strong>Tags:</strong> {project.tools}</p>
      </div>
    </aside>
  );
}