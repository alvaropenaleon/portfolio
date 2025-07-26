"use client";

import { useState } from 'react';
import styles from '@/styles/about/notifications.module.scss';
import { Notification } from "@/lib/definitions";
// import Image from 'next/image';

export default function ClientNotifications({ notifications }: { notifications: Notification[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.notificationsContainer}>
            <div
        className={`${styles.buttonWrapper} ${
          isExpanded ? styles.visible : styles.hidden
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>

      <ul
        className={`${styles.notificationsList} ${
          isExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        {notifications.map((note, idx) => (
          <li
            key={note.id}
            className={styles.notificationCard}
            onClick={idx === 0 && !isExpanded ? () => setIsExpanded(true) : undefined}
            style={{ cursor: idx === 0 && !isExpanded ? "pointer" : undefined }}
          >
            {note.cover_image_url && (
            /*  <Image
                src={note.cover_image_url}
                alt={`${note.title} cover`}
                fill
                style={{ objectFit: 'cover' }}
                fetchPriority="low"
                priority={false}
                />
            */
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
