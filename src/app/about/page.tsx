{/* 
import typo from "@/styles/ui/typography.module.css";
import clsx from "clsx"; 
import spacing from "@/styles/ui/space.module.css";
*/}

import SidebarLayout from "@/components/ui/sidebarLayout";
import Bio from "@/components/about/bio";
import Notifications from "@/components/about/notifications"; 
import layout from "@/styles/ui/layout.module.css";
import ClockClient from "@/components/about/clockClient";

// import ClockClient from "@/components/about/clockClient";
import { fetchUser } from "@/lib/data";

export default async function HomePage() {
  const user = await fetchUser();

  if (!user) {
    return <p className="text-red-500">User data not found.</p>;
  }

  const sidebarContent = (
 
    <div>
      {/*
      <a href={`mailto:${user.email}`}>Email</a>
      <br />
      <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
        Linkedin
      </a>
      <br />
      <a href={user.github} target="_blank" rel="noopener noreferrer">
        Github
      </a>
       <ClockClient />
      */}
    
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
          <Bio bio={user.bio} />
        </div>
        {/* 
        <p>{user.name}</p>
        <p>{user.title}</p>
        */}
      </main>
    </SidebarLayout>
  );
}
