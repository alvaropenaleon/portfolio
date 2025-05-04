// app/(desktop)/about/page.tsx
import Bio from '@/components/about/bio';
import { fetchUser } from '@/lib/data';

export default async function AboutPage() {

    const user = await fetchUser();
    if (!user) return <p className="text-red-500">User data not found.</p>;

    const content = (
        <main style={{ padding: "var(--space-md)" }}>
            <Bio markdown={user.bio} />
            <p><b>Want to say hi? </b>Tap a link below:</p>
            <br />
            <ul>
            <li><a
                href="mailto:alvleon@hotmail.com"
            >
                📬 Email me
            </a></li>

            <li><a
                href="https://github.com/alvaropenaleon"
                target="_blank"
                rel="noopener noreferrer"
            >
                🐙 GitHub
            </a></li>

            <li><a
                href="https://www.linkedin.com/in/alvaropenaleon/"
                target="_blank"
                rel="noopener noreferrer"
            >
                💼 LinkedIn
            </a></li>
            </ul>
            <br /><br />
            <p><i>When there’s time to write longer thoughts, they’ll land in my <b>blog</b>. I post rarely, but feel free to browse (<a
                href="https://www.linkedin.com/in/alvaropenaleon/"
                target="_blank"
                rel="noopener noreferrer"
            >find here</a>) if you’d like.
            </i></p>
            <br /><br />
        </main>
    );


    // otherwise fallback to the default Desktop layout
    return <>{content}</>;
}
