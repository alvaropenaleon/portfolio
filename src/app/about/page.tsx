// import Image from "next/image";
import layout from '@/styles/layout.module.css';
import typo from '@/styles/typography.module.css';
import { fetchUser } from "@/lib/data";

export default async function HomePage() {
  const user = await fetchUser();
  console.log("Fetched User:", user);

  return (
    <main>
        {user ? (
          <div className={layout.container}>

            <div className={layout.sidebar}>
              <p>Contact:</p>
              <a href={`mailto:${user.email}`}>{user.email}</a>
              <br />
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                linkedin.com/
                <span className={layout.desktopBreak}><br /></span>
                in/alvaropenaleon
              </a>
              <br />
              <a href={user.github} target="_blank" rel="noopener noreferrer">
                github.com/
                <span className={layout.desktopBreak}><br /></span>
                alvaropenaleon
              </a>
              <p>
                <strong>📍 Location:</strong> {user.location}
              </p>
            </div>

            <div className={layout.content}>
              <h1>Welcome to My Portfolio</h1>
              <h2>{user.name}</h2>
              <p className={typo.medium}>{user.title}</p>
              <h1> {user.bio}</h1>
              <h1>Currently</h1>
              <p>
                <strong>🎧 Listening to:</strong> {user.currentlyListening}
              </p>
              <p>
                <strong>📖 Reading:</strong> {user.currentlyReading}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">User data not found.</p>
        )}
    </main>
  );
}
