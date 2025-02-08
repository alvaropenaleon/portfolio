import { db } from "@vercel/postgres";

const client = await db.connect();

async function listProjects() {
  const data = await client.sql`
    SELECT * FROM projects;
  `;

  return data.rows;
}

async function listUsers() {
  const data = await client.sql`
    SELECT * FROM users;
  `;

  return data.rows;
}

export async function GET() {
  try {
    const projects = await listProjects();
    const users = await listUsers();
    return Response.json({ projects, users });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}