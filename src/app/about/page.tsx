import SidebarLayout from "@/components/ui/sidebarLayout";
import Bio from "@/components/about/bio";
import Notifications from "@/components/about/notifications"; 
import layout from "@/styles/ui/layout.module.css";
import ClockClient from "@/components/about/clockClient";
import { fetchUser } from "@/lib/data";
import color from "@/styles/ui/color.module.css";

export default async function HomePage() {
  const user = await fetchUser();

  if (!user) {
    return <p className="text-red-500">User data not found.</p>;
  }

  const sidebarContent = (
 
    <div>
    
      <div className={layout.sidebarBottom}>
        <Notifications />
        <ClockClient />
      </div>
    </div>
  );

  return (
    
    <SidebarLayout sidebar={sidebarContent} user={user}>
      <main>
        <div>
          <Bio bio={user.bio} /><br />
          <h2 className={color.brandGrey}>Explore <a href="/archive">my work</a> or <a href={`mailto:${user.email}`}>get in touch</a> to collaborate.</h2>
        </div>
      </main>
    </SidebarLayout>
  );
}
