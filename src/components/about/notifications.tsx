import { fetchNotifications } from "@/lib/data";
import ClientNotifications from '@/components/about/clientNotifications';

export default async function Notifications() {
  const notifications = await fetchNotifications();
  
  return <ClientNotifications notifications={notifications} />;
}