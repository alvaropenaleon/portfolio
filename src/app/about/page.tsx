import SidebarLayout from "@/components/ui/sidebarLayout";
import CurrentlyRow from "@/components/about/currentInfo"; // Use correctly named component
import typo from "@/styles/ui/typography.module.css";
import spacing from "@/styles/ui/space.module.css";
import DynamicText from "@/components/about/dynamicIntro";
import Clock from "@/components/about/clock";
import { fetchUser } from "@/lib/data";
import clsx from "clsx";

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
        <p>{user.name}</p>
        <p>{user.title}</p>

        <div className={spacing.lg}>
          <DynamicText />
        </div>

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

        <p className={clsx(spacing.xl3, typo.xxs)}>
          Website designed in Figma, built with Next.js using Typescript, Vanilla CSS, Neon Postgres, and deployed with Vercel. All text is set in the Inter typeface.
        </p>

      </main>
    </SidebarLayout>
  );
}
