{/* 
import CurrentlyRow from "@/components/about/currentInfo"; // Use correctly named component
import typo from "@/styles/ui/typography.module.css";
import clsx from "clsx"; 
*/}

import SidebarLayout from "@/components/ui/sidebarLayout";
import spacing from "@/styles/ui/space.module.css";
import BioComponent from "@/components/about/bio";

import ClockClient from "@/components/about/clockClient";
import { fetchUser } from "@/lib/data";

export default async function HomePage() {
  const user = await fetchUser();

  if (!user) {
    return <p className="text-red-500">User data not found.</p>;
  }

  const sidebarContent = (
    <div>
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
    </div>
  );

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <main>
        <div className={spacing.lg}>
          
          <BioComponent bio={user.bio} />
        </div>
        {/* 
        <p>{user.name}</p>
        <p>{user.title}</p>
        <p>{user.location}</p> 
        <div className={spacing.xl3}>
        <p>{user.bio}</p>
        </div>

        <div className={spacing.xl3}>
          <h2>Selected Projects</h2><hr className={spacing.sm}/>
          <p className={typo.md}>More of my work</p>
        </div>

        <div className={spacing.xl3}>
          <h2>Currently</h2><hr className={spacing.sm} />
          <CurrentlyRow type="📖 Reading" title={user.currentlyReading} />
          <CurrentlyRow type="🎧 Listening" title={user.currentlyListening} />
        </div>
        */}
      </main>
    </SidebarLayout>
  );
}
