import SidebarLayout from '@/components/ui/sidebarLayout';
import CurrentlyRow from '@/components/about/currently'; // Use correctly named component
// import type from '@/styles/ui/typography.module.css';
import DynamicText from '@/components/about/dynamicText';
import { fetchUser } from "@/lib/data";

export default async function HomePage() {
  const user = await fetchUser();

  if (!user) {
    return <p className="text-red-500">User data not found.</p>;
  }

  // Define sidebar content
  const sidebarContent = (
    <>
      <p>Contact:</p>
      <a href={`mailto:${user.email}`}>{user.email}</a>
      <br />
      <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
        linkedin.com/<span className="desktopBreak"><br /></span>in/alvaropenaleon
      </a>
      <br />
      <a href={user.github} target="_blank" rel="noopener noreferrer">
        github.com/<span className="desktopBreak"><br /></span>alvaropenaleon
      </a>
      <p>{user.location}</p>
    </>
  );

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <main>
        <h2>{user.name}</h2>
        <p>{user.title}</p>
        <DynamicText />
        <p>{user.bio}</p>

        <h1>Currently</h1>
        <div>
          <CurrentlyRow type="📖 Reading" title={user.currentlyReading} />
          <CurrentlyRow type="🎧 Listening" title={user.currentlyListening} />
        </div>
      </main>
    </SidebarLayout>
  );
}
