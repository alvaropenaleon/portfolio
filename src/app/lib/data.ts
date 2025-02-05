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

export async function fetchSelectedWork(): Promise<Project[]> {
  try {
    const projects = await sql<Project>`
      SELECT 
        p.id, 
        p.title, 
        p.description,
        ARRAY_AGG(DISTINCT pt.tool) AS tools,
        ARRAY_AGG(DISTINCT pc.category) AS categories,
        ARRAY_AGG(DISTINCT pl.link) AS links
      FROM projects p
      LEFT JOIN project_tools pt ON p.id = pt.project_id
      LEFT JOIN project_categories pc ON p.id = pc.project_id
      LEFT JOIN project_links pl ON p.id = pl.project_id
      GROUP BY p.id, p.title, p.description
      ORDER BY p.date DESC
      LIMIT 5;
    `;

    return projects.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch selected work.');
  }
}

