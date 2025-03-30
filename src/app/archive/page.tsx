import { fetchFilteredProjects, fetchUser, ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveClient from '@/components/archive/archiveClient';
import SidebarLayout from '@/components/ui/sidebarLayout';
import Search from '@/components/archive/search';
import Pagination from '@/components/archive/pagination';

interface ArchivePageProps {
    searchParams: Promise<{
        query?: string;
        page?: string;
    }>;
}
export const revalidate = 120;


export default async function ArchivePage({ searchParams }: ArchivePageProps) {
    const sp = await searchParams;

    const query = sp.query ?? '';
    const currentPage = Number(sp.page) || 1;

    const user = await fetchUser();
    const { projects, totalPages } = await fetchFilteredProjects(
        query,
        currentPage,
        ITEMS_PER_PAGE
    );

    const sidebarContent = (
        <></>
    );

    return (
        <SidebarLayout sidebar={sidebarContent} user={user}>
            <Search />
            <ArchiveClient projects={projects} searchTerm={query} />
            <Pagination totalPages={totalPages} />
        </SidebarLayout>
    );
}
