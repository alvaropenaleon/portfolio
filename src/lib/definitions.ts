export type User = {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  linkedin: string;
  github: string;
  location: string;
  currentlyListening: string;
  currentlyReading: string;
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