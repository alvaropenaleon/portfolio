// src/app/api/archive/route.ts
import { NextResponse } from 'next/server';
import {
  fetchFilteredProjects,
  fetchProjectCategories,
  fetchProjectTags,
  ITEMS_PER_PAGE,
} from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? '';
  const category = searchParams.get('category') ?? '';
  const tag = searchParams.get('tag') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const [{ projects, totalPages }, categories, tags] = await Promise.all([
    fetchFilteredProjects(query, category, tag, page, ITEMS_PER_PAGE),
    fetchProjectCategories(),
    fetchProjectTags(),
  ]);

  return NextResponse.json({ projects, totalPages, categories, tags });
}
