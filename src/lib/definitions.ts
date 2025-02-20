export type User = {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: {text: string; class:string} [];
  linkedin: string;
  github: string;
  location: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  links: { url: string; type: 'code' | 'demo' }[];
  tools: string[];
  heroImage: string;
  categories: string[];
  text: string;
  role: string;
  date: string;
  // projectImages: string[];
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