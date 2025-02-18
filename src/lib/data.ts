import { sql } from '@vercel/postgres';
import {
    User,
    Project
} from './definitions';

export async function fetchUser(){
    try {
      const data = await sql<User>`
        SELECT
            name,
            email,
            title,
            bio,
            linkedin,
            github,
            location,
            currentlylistening AS "currentlyListening",
            currentlyreading AS "currentlyReading"
        FROM users
        ORDER BY name ASC
      `;
  
      const user = data.rows[0];
      return user;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch user.');
    }
}

export async function fetchAllProjects(): Promise<Project[]> {
  try {
    const projects = await sql<Project>`
      SELECT 
        p.id, 
        p.title, 
        p.description,
        p.text,
        p.heroimage AS "heroImage",
        p.role,
        p.date,
        ARRAY_AGG(DISTINCT pc.category) AS categories,
        ARRAY_AGG(DISTINCT pt.tool) AS tools,
        ARRAY_AGG(DISTINCT jsonb_build_object('url', pl.link, 'type', pl.type)) AS links,
        ARRAY_AGG(DISTINCT pi.image) AS images
      FROM projects p
      LEFT JOIN project_categories pc ON p.id = pc.project_id
      LEFT JOIN project_tools pt ON p.id = pt.project_id
      LEFT JOIN project_links pl ON p.id = pl.project_id
      LEFT JOIN project_images pi ON p.id = pi.project_id
      GROUP BY p.id, p.title, p.description, p.text, p.heroimage, p.role, p.date
      ORDER BY p.date DESC;
    `;

    return projects.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all projects.');
  }
}

export async function fetchProjectById(id: string[]): Promise<Project[]> {
  if (id.length === 0) return [];
  try {
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.description,
        p.text,
        p.heroimage AS "heroImage",
        p.role,
        p.date,
        ARRAY_AGG(DISTINCT pc.category) AS categories,
        ARRAY_AGG(DISTINCT pt.tool) AS tools,
        ARRAY_AGG(DISTINCT jsonb_build_object('url', pl.link, 'type', pl.type)) AS links,
        ARRAY_AGG(DISTINCT pi.image) AS images
      FROM projects p
      LEFT JOIN project_categories pc ON p.id = pc.project_id
      LEFT JOIN project_tools pt ON p.id = pt.project_id
      LEFT JOIN project_links pl ON p.id = pl.project_id
      LEFT JOIN project_images pi ON p.id = pi.project_id
      WHERE p.id = ANY($1::uuid[])
      GROUP BY p.id, p.title, p.description, p.text, p.heroimage, p.role, p.date
      ORDER BY p.date DESC;
    `;

    const projects = await sql.query(query, [id]);
    return projects.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch project by ID.');
  }
}


