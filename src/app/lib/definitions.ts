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

// export type Project = {
//   id: string;
//   title: string;
//   description: string;
//   links: string[];
//   tools: string[];
//   heroImage: string;
//   categories: string[];
//   text: string;
//   role: string;
//   date: string;
//   projectImages: string[];
// };

export type ProjectCard = {
  id: string;
  title: string;
  description: string;
  tools: string[];
  categories: string[];
  links: string[];
};