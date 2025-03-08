import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Professional Website",
  description: "Discover side hustles that make this world a better place!",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
