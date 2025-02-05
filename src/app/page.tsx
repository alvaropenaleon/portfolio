// import Image from "next/image";
// import styles from "./page.module.css";

import { fetchUser } from '@/app/lib/data';

export default async function HomePage() {
  const user = await fetchUser();
  console.log("Fetched User:", user); 

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome to My Portfolio</h1>

      {user ? (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.title}</p>
          <p>{user.bio}</p>

          <div className="mt-2">
            <p>
              <strong>📍 Location:</strong> {user.location}
            </p>
            <p>
              <strong>🎧 Listening to:</strong> {user.currentlyListening}
            </p>
            <p>
              <strong>📖 Reading:</strong> {user.currentlyReading}
            </p>
          </div>

          <div className="mt-4 flex gap-4">
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              LinkedIn
            </a>
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline"
            >
              GitHub
            </a>
          </div>
        </section>
      ) : (
        <p className="text-red-500">User data not found.</p>
      )}
    </main>
  );
}