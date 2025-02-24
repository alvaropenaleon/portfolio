"use client";

import { useState } from 'react';
import styles from '@/styles/about/notifications.module.scss';
import { Notification } from "@/lib/definitions";

export default function ClientNotifications({ notifications }: { notifications: Notification[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.notificationsContainer}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.expandButton}
      >
        {isExpanded ? '↓ Show Less' : '↑ Show More'}
      </button>

      <ul
        className={`${styles.notificationsList} ${
          isExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        {notifications.map((note) => (
          <li key={note.id} className={styles.notificationCard}>
            {note.cover_image_url && (
              <img
                src={note.cover_image_url}
                alt={`${note.title} cover`}
                className={styles.cover}
                fetchPriority="low"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className={styles.details}>
              <span className={styles.activityLabel}>{note.category}</span>
              <h3>{note.title}</h3>
              {note.subtitle && <p>{note.subtitle}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
