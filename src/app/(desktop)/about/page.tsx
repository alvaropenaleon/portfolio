import Bio from "@/components/about/bio";
import { fetchUser } from "@/lib/data";
import color from "@/styles/ui/color.module.css";

export default async function HomePage() {
    const user = await fetchUser();

    if (!user) {
        return <p className="text-red-500">User data not found.</p>;
    }

    return (
        <>
            <main>
                <div>
                    <Bio bio={user.bio} /><br /><br />
                    <h2 className={color.brandGrey}>Explore <a href="/archive">my work</a> or <a href={`mailto:${user.email}`}>get in touch</a> to collaborate.</h2>
                </div>
            </main>
        </>
    );
}
