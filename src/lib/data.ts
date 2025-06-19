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

export async function fetchProjectCategories(): Promise<string[]> {
  try {
    const result = await sql<{ category: string }>`
      SELECT DISTINCT category FROM project_categories ORDER BY category ASC
    `;
    return result.rows.map(row => row.category);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch project categories.");
  }
}

/**
 * fetchFilteredProjects
 * @param query - The search query from the URL (if any)
 * @param page - The current page number (1-based)
 * @param limit - Number of items per page
 * @returns An object containing the filtered projects and total pages
 */

export const ITEMS_PER_PAGE = 6;

export async function fetchFilteredProjects(
    query: string = '',
    page: number = 1,
    limit: number = ITEMS_PER_PAGE
  ) {
    const offset = (page - 1) * limit;
    const isQueryEmpty = query.trim() === '';
  
    //  main SELECT
    let mainQuery = `
      SELECT
        p.id,
        p.title,
        p.description,
        p.heroimage AS "heroImage",
        p.date,
        ARRAY_AGG(DISTINCT pc.category) AS categories,
        ARRAY_AGG(DISTINCT pt.tool) AS tools,
        ARRAY_AGG(DISTINCT jsonb_build_object('url', pl.link, 'type', pl.type)) AS links
      FROM projects p
      LEFT JOIN project_categories pc ON p.id = pc.project_id
      LEFT JOIN project_tools pt ON p.id = pt.project_id
      LEFT JOIN project_links pl ON p.id = pl.project_id
    `;
  
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) AS "totalCount"
      FROM projects p
      LEFT JOIN project_categories pc ON p.id = pc.project_id
      LEFT JOIN project_tools pt ON p.id = pt.project_id
      LEFT JOIN project_links pl ON p.id = pl.project_id
    `;
  
    // WHERE logic, same clause for both queries
    // parameter array
    let whereClause = '';
    const queryValues: unknown[] = []; 
  
    if (!isQueryEmpty) {
      // If query is NOT empty do  ILIKE 
      whereClause = `WHERE (p.title ILIKE $1 OR p.description ILIKE $1)`;
      queryValues.push(`%${query}%`); // $1
    }
  
    // add GROUP BY, ORDER, LIMIT/OFFSET to main query
    // if we had 1 param above, LIMIT is $2, OFFSET is $3, eetc
    // if we had 0, then they shift to $1, $2, etc
    const paramIndexBase = isQueryEmpty ? 1 : 2; 
  
    mainQuery += `
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.date DESC
      LIMIT $${paramIndexBase}
      OFFSET $${paramIndexBase + 1}
    `;
  
    // count query no GROUP BY 
    countQuery += `
      ${whereClause}
    `;
  
    //  push limit/offset values
    queryValues.push(limit);  // $2 if isQueryEmpty else $3
    queryValues.push(offset); // $3 if isQueryEmpty else $4
  
    try {
      // run both queries in parallel
      const [projectsData, countData] = await Promise.all([
        sql.query<Project>(mainQuery, queryValues),
        sql.query<{ totalCount: number }>(countQuery, isQueryEmpty ? [] : [queryValues[0]])
          // count query only needs the $1 param if there s a query
          // if isQueryEmpty is false  pass `[queryValues[0]]`
          // otherwise an empty array
      ]);
  
      // get the totalCount
      const totalCount = Number(countData.rows[0]?.totalCount ?? 0);
      const totalPages = Math.ceil(totalCount / limit);
  
      return {
        projects: projectsData.rows,
        totalPages
      };
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch filtered projects.');
    }
}

/*
export async function fetchFilteredProjects(
    query: string = '',
    page: number = 1,
    limit: number = ITEMS_PER_PAGE
  ): Promise<{ projects: Project[]; totalPages: number }> {
    const offset = (page - 1) * limit;
  
    try {
      // We run two queries in parallel with Promise.all:
      // 1) Main query: get projects for this page
      // 2) Count query: get total count for pagination
  
      const [projectsData, countData] = await Promise.all([
        //
        // MAIN QUERY
        //
        sql<Project>`
          SELECT
            p.id,
            p.title,
            p.description,
            -- p.text,
            p.heroimage AS "heroImage",
            -- p.role,
            p.date,
            ARRAY_AGG(DISTINCT pc.category) AS categories,
            ARRAY_AGG(DISTINCT pt.tool) AS tools,
            ARRAY_AGG(DISTINCT jsonb_build_object('url', pl.link, 'type', pl.type)) AS links
            -- ARRAY_AGG(DISTINCT pi.image) AS images
          FROM projects p
          LEFT JOIN project_categories pc ON p.id = pc.project_id
          LEFT JOIN project_tools pt ON p.id = pt.project_id
          LEFT JOIN project_links pl ON p.id = pl.project_id
          -- LEFT JOIN project_images pi ON p.id = pi.project_id
  
          
          //  We always use this WHERE block. If query='' (empty),
          //  the condition (query='') is TRUE, so it won't filter out anything.
          //  If query != '', we check (title ILIKE '%query%' OR description ILIKE '%query%').
          
          WHERE (
            p.title ILIKE ${'%' + query + '%'}
            OR p.description ILIKE ${'%' + query + '%'}
            OR ${query === ''}
          )
  
          GROUP BY p.id
          ORDER BY p.date DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `,
        //
        // COUNT QUERY
        //
        sql<{ totalCount: number }>`
          SELECT COUNT(DISTINCT p.id) AS "totalCount"
          FROM projects p
          LEFT JOIN project_categories pc ON p.id = pc.project_id
          LEFT JOIN project_tools pt ON p.id = pt.project_id
          LEFT JOIN project_links pl ON p.id = pl.project_id
          -- LEFT JOIN project_images pi ON p.id = pi.project_id
  
          WHERE (
            p.title ILIKE ${'%' + query + '%'}
            OR p.description ILIKE ${'%' + query + '%'}
            OR ${query === ''}
          )
        `
      ]);
  
      // Calculate total pages from the totalCount
      const totalCount = Number(countData.rows[0].totalCount);
      const totalPages = Math.ceil(totalCount / limit);
  
      return {
        projects: projectsData.rows,
        totalPages
      };
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch filtered projects.');
    }
}
*/