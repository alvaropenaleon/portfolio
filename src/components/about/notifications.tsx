import { fetchNotifications } from "@/lib/data";

export default async function NotificationsPage() {
  const notifications = await fetchNotifications();

  return (
    <div>
      <ul>
        {notifications.map((note) => (
          <li key={note.id}>
            {note.category}
            {note.title}
            {note.subtitle}
          </li>
        ))}
      </ul>
    </div>
  );
}
