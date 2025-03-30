import { NextResponse } from 'next/server';
import { fetchProjectById } from '@/lib/data';
import { Project } from '@/lib/definitions';

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

// GET /api/projects/:id
export async function GET(request: Request, props: ProjectPageProps) {
    const params = await props.params;
    const projectData: Project[] = await fetchProjectById([params.id]);
    console.log('projectData:', projectData);

    if (!projectData.length) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const project = projectData[0];
    return NextResponse.json(project);
}
