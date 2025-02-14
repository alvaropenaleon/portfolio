import SidebarLayout from "@/components/ui/sidebarLayout";
import CurrentlyRow from "@/components/about/currentInfo"; // Use correctly named component
import typo from "@/styles/ui/typography.module.css";
import DynamicText from "@/components/about/dynamicIntro";
import Clock from "@/components/about/clock";
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
      <Clock />
      {/* <p>{user.location}</p> */}
    </div>
  );

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <main>
        <h2>{user.name}</h2>
        <p>{user.title}</p>
        <div>
          <DynamicText />
        </div>
        <p>{user.bio}</p>

        <h1>Selected Projects</h1>
        <hr />
        <p className={typo.medium}>More of my work</p>

        <h1>Currently</h1>
        <hr />
        <div>
          <CurrentlyRow type="📖 Reading" title={user.currentlyReading} />
          <CurrentlyRow type="🎧 Listening" title={user.currentlyListening} />
        </div>
      </main>
    </SidebarLayout>
  );
}
