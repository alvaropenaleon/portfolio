import { fetchUser, fetchFilteredProjects, fetchProjectCategories, fetchProjectTags, ITEMS_PER_PAGE } from '@/lib/data';
import DesktopShell from '@/components/desktop/desktopShell';

export default async function DesktopPage() {
  const user = await fetchUser();

  const [{ projects, totalPages }, categories, tags] = await Promise.all([
    fetchFilteredProjects("", "", "", 1, ITEMS_PER_PAGE),
    fetchProjectCategories(),
    fetchProjectTags(),
  ]);

  const preload = {
    about: { bio: user.bio },
    archive: {
      projects,
      totalPages,
      categories,
      tags,
      query: "",
      category: "",
      tag: "",
    }
  };

  return <DesktopShell preload={preload} />;
}
