// components/about/notifications.tsx
import { fetchNotifications } from "@/lib/data";
import ClientNotifications from '@/components/about/ClientNotifications';

export default async function Notifications() {
  const notifications = await fetchNotifications();
  
  return <ClientNotifications notifications={notifications} />;
}