// src/app/api/user/route.ts
import { NextResponse } from 'next/server';
import { fetchUser } from '@/lib/data';

export async function GET() {
  const user = await fetchUser();
  return NextResponse.json(user);
}
