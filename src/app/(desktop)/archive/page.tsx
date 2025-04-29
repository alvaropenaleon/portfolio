import { fetchFilteredProjects, ITEMS_PER_PAGE } from '@/lib/data';
import ArchiveClient from '@/components/archive/archiveClient';
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

    const { projects, totalPages } = await fetchFilteredProjects(
        query,
        currentPage,
        ITEMS_PER_PAGE
    );


    return (
        <>
            <Search />
            <ArchiveClient projects={projects} searchTerm={query} />
            <Pagination totalPages={totalPages} />
        </>
    );
}
