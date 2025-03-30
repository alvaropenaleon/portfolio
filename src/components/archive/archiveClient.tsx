"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArchiveList from "@/components/archive/archiveList";
import ProjectCard from "@/components/project/projectCard";
import { Project } from "@/lib/definitions";

type ArchiveClientProps = {
    projects: Project[];
    searchTerm: string;
};

export default function ArchiveClient({ projects, searchTerm }: ArchiveClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [openProject, setOpenProject] = useState<Project | null>(null);

    useEffect(() => {
        const existing = searchParams.get("project");
        if (existing) {
            fetchAndSetProject(existing);
        }
    }, [searchParams]);

    async function fetchAndSetProject(id: string) {
        try {
            const res = await fetch(`/api/project/${id}`);
            if (!res.ok) {
                setOpenProject(null);
                return;
            }
            const data = await res.json();
            setOpenProject(data);
        } catch (err) {
            console.error("Error loading project:", err);
            setOpenProject(null);
        }
    }

    const handleOpenProject = async (id: string) => {
        await fetchAndSetProject(id);

        // Update the URL with ?project=, keep any other params (page=2)
        const params = new URLSearchParams(window.location.search);
        params.set("project", id);
        router.push(`?${params}`, { scroll: false });
    };

    const handleClose = () => {
        setOpenProject(null);

        // Remove ?project= from the query
        const params = new URLSearchParams(window.location.search);
        params.delete("project");
        router.push(`?${params}`, { scroll: false });
    };

    return (
        <>
            {/* Existing archive list */}
            <ArchiveList
                projects={projects}
                searchTerm={searchTerm}
                onOpenProject={handleOpenProject}
            />

            {/* Mount the project if projectexists */}
            {openProject && (
                <ProjectCard
                    project={openProject}
                    onClose={handleClose}
                />
            )}
        </>
    );
}
