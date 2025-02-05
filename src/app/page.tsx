// import Image from "next/image";
// import styles from "./page.module.css";

import { fetchUser } from "@/app/lib/data";

export default async function HomePage() {
  const user = await fetchUser();
  console.log("Fetched User:", user);

  return (
    <main>
      <h1>Welcome to My Portfolio</h1>

      {user ? (
        <section>
          <h2>{user.name}</h2>
          <p>{user.title}</p>
          <p>{user.bio}</p>

          <div>
            <p>
              <strong>📍 Location:</strong> {user.location}
            </p>
            <h1>Currently</h1>
            <p>
              <strong>🎧 Listening to:</strong> {user.currentlyListening}
            </p>
            <p>
              <strong>📖 Reading:</strong> {user.currentlyReading}
            </p>
          </div>

          <div className="mt-2">
            <p>Contact:</p>
            <a href={`mailto:${user.email}`}>{user.email}</a>
            <br />
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
              https://linkedin.com/in/alvaropenaleon
            </a>
            <br />
            <a href={user.github} target="_blank" rel="noopener noreferrer">
              https://github.com/alvaropenaleon
            </a>
          </div>
        </section>
      ) : (
        <p className="text-red-500">User data not found.</p>
      )}
    </main>
  );
}
