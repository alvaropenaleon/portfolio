// app/notifications/page.tsx
import { fetchNotifications } from "@/lib/data";
import styles from "@/styles/about/notifications.module.css";

export default async function NotificationsPage() {
  const notifications = await fetchNotifications();

  return (
    <div className={styles.notificationsContainer}>
      
      {/*  Absolutely-positioned list */}
      <ul className={styles.notificationsList}>
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
