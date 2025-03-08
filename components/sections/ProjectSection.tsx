import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Project } from "@/lib/types/project";

interface ProjectSectionProps {
  project: Project;
  index: number;
}

export function ProjectSection({ project, index }: ProjectSectionProps) {
  const projectVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="pt-16 first:pt-0"
      variants={projectVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div
        className={`flex flex-col gap-8 lg:flex-row ${
          project.position === "left" ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:w-1/2">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>

        {/* Content Section */}
        <div className="flex w-full flex-col justify-center lg:w-1/2">
          <h2 className="mb-2 text-3xl font-bold">{project.title}</h2>
          <h3 className="mb-4 text-xl text-muted-foreground">
            {project.subtitle}
          </h3>
          <p className="mb-6 text-muted-foreground">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* View Project Button */}
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 border border-gray-200"
              variant="ghost"
            >
              View Project
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
