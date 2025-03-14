import { sql } from '@vercel/postgres';
import {
    User,
    Project,
    Notification
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
            location
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

export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const { rows } = await sql<Notification>`
      SELECT
        id,
        category,
        title,
        subtitle,
        cover_image_url,
        last_updated
      FROM notifications
      ORDER BY last_updated DESC
    `;
    return rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch notifications.");
  }
}

export const ITEMS_PER_PAGE = 10;


export async function fetchFilteredProjects(
    query: string,
    currentPage: number,
    category: string
  ): Promise<{ projects: Project[]; totalCount: number }> {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const conditions: string[] = [];
    const values: string[] = [];
    
    // Build search condition for title, description, or text
    if (query) {
      values.push(`%${query}%`);
      conditions.push(
        `(p.title ILIKE $${values.length} OR p.description ILIKE $${values.length} OR p.text ILIKE $${values.length})`
      );
    }
    
    // Build category filter condition using an EXISTS subquery
    if (category) {
      values.push(category);
      conditions.push(
        `EXISTS (SELECT 1 FROM project_categories pc2 WHERE pc2.project_id = p.id AND pc2.category = $${values.length})`
      );
    }
    
    // Create the WHERE clause if any conditions exist
    const whereSQL = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Build the projects query
    const projectsQuery = `
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
      ${whereSQL}
      GROUP BY p.id, p.title, p.description, p.text, p.heroimage, p.role, p.date
      ORDER BY p.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    
    // Build the count query
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) AS count
      FROM projects p
      LEFT JOIN project_categories pc ON p.id = pc.project_id
      ${whereSQL}
    `;
    
    try {
      const projectsResult = await sql.query<Project>({ text: projectsQuery, values });
      const countResult = await sql.query<{ count: number }>({ text: countQuery, values });
      const totalCount = countResult.rows[0]?.count || 0;
      return { projects: projectsResult.rows, totalCount };
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch filtered projects.');
    }
  }
  
  
