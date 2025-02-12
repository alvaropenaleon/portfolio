import SidebarLayout from '@/components/ui/sidebarLayout';
import CurrentlyRow from '@/components/about/currently'; // Use correctly named component
import type from '@/styles/ui/typography.module.css';
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
      <h2>{user.name}</h2>
      <p>{user.title}</p>
      <h1 className={type.intro}>{user.bio}</h1>

      <h1>Currently</h1>
      <div className="currently-list">
        <CurrentlyRow type="📖 Reading" title={user.currentlyReading} />
        <CurrentlyRow type="🎧 Listening" title={user.currentlyListening} />
      </div>

    </SidebarLayout>
  );
}
