import layout from '@/styles/layout.module.css';
import typo from '@/styles/typography.module.css';
import { fetchUser } from "@/lib/data";

export default async function HomePage() {
  const user = await fetchUser();

  return (
    <main>
      {user ? (
        <div className={layout.container}>
          {/* 1) CONTENT FIRST in the DOM */}
          <div className={layout.content}>
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
          </div>

          {/* 2) SIDEBAR SECOND in the DOM */}
          <div className={layout.sidebar}>
            {/* If you want top/bottom sections: */}
            <div>
              {/* top part (optional) */}
            </div>
            <div className={layout.sidebarBottom}>
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
              <p>{user.location}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">User data not found.</p>
      )}
    </main>
  );
}
