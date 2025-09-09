// src/lib/definitions.ts
export type User = {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  linkedin: string;
  github: string;
  location: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  links: { url: string; type: string }[];
  tags: string[];
  heroImage: string;
  categories: string[];
  text: string;
  role: string;
  date: string;
  images: string[];
};

export type Notification = {
  id: number;
  category: string;
  title: string;
  subtitle?: string;
  cover_image_url?: string;
  last_updated?: Date;
};

// Window payloads
export type AboutPayload = { bio: string };

export type ArchivePayload = {
  projects: Project[];
  totalPages: number;
  categories: string[];
  tags: string[];
  // window-local filter state
  query: string;
  category: string;
  tag: string;
};

export type WorkPayload = { projectId?: string } | null;

export type ImagePayload = { src: string; title?: string };

export interface WindowPayloads {
  about: AboutPayload;
  archive: ArchivePayload;
  work: WorkPayload;
  image: ImagePayload;
}

export type WindowID = keyof WindowPayloads; // 'about' | 'archive' | 'work' | 'image'

// Archive filter helpers
export type ArchiveFilters = {
  query: string;
  category: string;
  tag: string;
  page?: string; // optional; if omitted treat as '1'
};
