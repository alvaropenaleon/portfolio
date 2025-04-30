// app/(desktop)/about/page.tsx
import Bio from '@/components/about/bio';
import { fetchUser } from '@/lib/data';
import color from '@/styles/ui/color.module.css';

export default async function AboutPage() {

    const user = await fetchUser();
    if (!user) return <p className="text-red-500">User data not found.</p>;

    const content = (
        <main>
            <Bio bio={user.bio} /><br /><br />
            <h2 className={color.brandGrey}>
                Explore <a href="/archive">my work</a> or
                <a href={`mailto:${user.email}`}> get in touch</a>.
            </h2>
        </main>
    );


    // otherwise fallback to the default Desktop layout
    return <>{content}</>;
}
