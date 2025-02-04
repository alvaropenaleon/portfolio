import { db } from '@vercel/postgres';
import { users, projects } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      title VARCHAR(255),
      bio TEXT,
      linkedin TEXT,
      github TEXT,
      location TEXT,
      currentlyListening TEXT,
      currentlyReading TEXT
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      return client.sql`
        INSERT INTO users (id, name, email, title, bio, linkedin, github, location, currentlyListening, currentlyReading)
        VALUES (${user.name}, ${user.email}, ${user.title}, ${user.bio}, ${user.linkedin}, ${user.github}, ${user.location}, ${user.currentlyListening}, ${user.currentlyReading})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedProjects() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      heroImage TEXT,
      text TEXT,
      role VARCHAR(255),
      date TEXT
    );
  `;

  await client.sql`
    CREATE TABLE IF NOT EXISTS project_links (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_id UUID REFERENCES projects(id),
      link TEXT
    );
  `;

  await client.sql`
    CREATE TABLE IF NOT EXISTS project_tools (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_id UUID REFERENCES projects(id),
      tool TEXT
    );
  `;

  await client.sql`
    CREATE TABLE IF NOT EXISTS project_categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_id UUID REFERENCES projects(id),
      category TEXT
    );
  `;

  await client.sql`
    CREATE TABLE IF NOT EXISTS project_images (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_id UUID REFERENCES projects(id),
      image TEXT
    );
  `;

  const insertedProjects = await Promise.all(
    projects.map(async (project) => {
      const insertedProject = await client.sql`
        INSERT INTO projects (id, title, description, heroImage, "text", role, date)
        VALUES (${project.title}, ${project.description}, ${project.heroImage}, ${project.text}, ${project.role}, ${project.date})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;

      const projectId = insertedProject.rows[0].id;

      await Promise.all(project.links.map(link => client.sql`
        INSERT INTO project_links (project_id, link)
        VALUES (${projectId}, ${link});
      `));

      await Promise.all(project.tools.map(tool => client.sql`
        INSERT INTO project_tools (project_id, tool)
        VALUES (${projectId}, ${tool});
      `));

      await Promise.all(project.categories.map(category => client.sql`
        INSERT INTO project_categories (project_id, category)
        VALUES (${projectId}, ${category});
      `));

      await Promise.all(project.projectImages.map(image => client.sql`
        INSERT INTO project_images (project_id, image)
        VALUES (${projectId}, ${image});
      `));

      return insertedProject;
    }),
  );

  return insertedProjects;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedProjects();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}