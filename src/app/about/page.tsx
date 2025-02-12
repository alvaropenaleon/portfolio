// app/page.tsx (or any page file)
import SidebarLayout from '@/components/ui/sidebarLayout';
import typo from '@/styles/ui/typography.module.css';
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
      <h1 className={typo.intro}>{user.bio}</h1>
      <h1>Currently</h1>
      <p>
        <strong>Listening 🎧🎵</strong> {user.currentlyListening}
      </p>
      <p>
        <strong>Reading 📖</strong> {user.currentlyReading}
      </p>
    </SidebarLayout>
  );
}
