export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string[];
  position: "left" | "right";
}
