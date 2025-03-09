"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  ChevronRight,
  Sparkles,
  Code,
  FileAudio,
  FileText,
  Zap,
  Monitor,
  X,
  ArrowUpRight,
} from "lucide-react";

// Define the AiWork type since we're not importing it from shared schema
interface AiWork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  mediaType: "image" | "video";
  demoUrl: string | null;
  technologies: string[];
}

// Animation variants for scroll animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Function to get appropriate icon for each project
const getProjectIcon = (title: string) => {
  if (title.includes("Screen Reader")) return <Monitor className="h-6 w-6" />;
  if (title.includes("Flashcards") || title.includes("Spelling"))
    return <FileText className="h-6 w-6" />;
  if (title.includes("Logging")) return <Code className="h-6 w-6" />;
  if (title.includes("Website")) return <Monitor className="h-6 w-6" />;
  if (title.includes("Voice") || title.includes("Omi Apps"))
    return <FileAudio className="h-6 w-6" />;
  if (title.includes("Component") || title.includes("Code Editing"))
    return <Code className="h-6 w-6" />;
  if (title.includes("Video Analysis")) return <Monitor className="h-6 w-6" />;
  return <Sparkles className="h-6 w-6" />;
};

// Hardcoded AI works data
const aiWorksData: AiWork[] = [
  {
    id: "1",
    title: "AI Screen Reader: A Real-Time Voice Tutor",
    description:
      "A screen reader that not only reads but also teaches and interacts in real time. I envisioned a tool that could transform passive screen consumption into an active learning experience. Inspired by Google AI Studio, I built an AI screen reader that analyzes text on a screen, explains its content, and engages in interactive discussions with the user.",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: [
      "OpenAI Whisper",
      "GPT Models",
      "Voice Synthesis",
      "Real-time Analysis",
    ],
  },
  {
    id: "2",
    title: "Flashcards for Spelling Bee: A Niece's Overnight Hack",
    description:
      "When my niece needed a study tool, I built one overnight. My niece had just qualified for the next round of a Spelling Bee competition. She needed a quick and efficient way to memorize hundreds of words but struggled with traditional methods. That night, I wrote a Python script that converted word lists into Anki flashcards, complete with pronunciation and example sentences.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: ["Python", "Pandas", "Anki API", "Spaced Repetition"],
  },
  {
    id: "3",
    title: "Automated Work Logging with AI",
    description:
      "Screenshots, AI analysis, and smart documentation in one flow. Every day, we spend hours working on projects but rarely document them efficiently. I built an AI-driven automation tool that takes periodic screenshots, feeds them into ChatGPT for contextual analysis, and allows users to add prompts for insights—all in a single step.",
    imageUrl:
      "https://images.unsplash.com/photo-1495511167051-13bb07bde85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: ["Python", "OpenCV", "OpenAI API", "Automation"],
  },
  {
    id: "4",
    title: "Building a Website in 40 Hours for $30 with AI",
    description:
      "AI-powered coding made website building accessible and rapid. I wanted to test how far AI tools could go in helping non-developers build a functional, professional website. My challenge was to create a fully operational site from scratch in under 40 hours while spending no more than $30.",
    imageUrl:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: ["Replit", "ChatGPT", "Vercel", "Bootstrap"],
  },
  {
    id: "5",
    title: "Omi Apps: Capturing Memories with Voice Transcription",
    description:
      "An app that turns your voice into retrievable memories. In a world where we take thousands of photos but forget key moments, I wanted a way to record fleeting thoughts, experiences, and insights effortlessly. I developed an AI-powered voice recording app that transcribes and categorizes memories for later retrieval.",
    imageUrl:
      "https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: [
      "Whisper",
      "Speech-to-Text",
      "Custom Tagging",
      "Search System",
    ],
  },
  {
    id: "6",
    title: "AI-Assisted Code Editing & Component Isolation",
    description:
      "A methodology for efficient AI-driven app development. AI-assisted coding is powerful but often chaotic. I needed a way to ensure modular development where AI-generated components don't interfere with each other. By designing a structured workflow where components are developed and validated independently before integration, I was able to build AI apps more efficiently.",
    imageUrl:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: [
      "GitHub Copilot",
      "OpenAI API",
      "Modular Development",
      "Code Validation",
    ],
  },
  {
    id: "7",
    title: "Interactive AI Voice Agent for Live Video Analysis",
    description:
      "An AI-driven assistant that understands what you see and speaks to you in real time. Inspired by real-time streaming analytics, I built a voice AI assistant that can analyze a video feed and provide contextual information on the fly. The goal was to enhance remote learning and research workflows by making visual content interactive.",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    mediaType: "image",
    demoUrl: null,
    technologies: [
      "OpenCV",
      "Whisper",
      "GPT Models",
      "Real-time Context Extraction",
    ],
  },
];

export default function AiWorks() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeDescription, setActiveDescription] = useState<AiWork | null>(
    null
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const [heroInView, setHeroInView] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroInView(true), 300);

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isInView) {
          sectionRef.current.classList.add("in-view");
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="relative bg-[#222222] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <Brain className="h-10 w-10 text-[#F8F8F8]" />
                <h1 className="text-5xl font-bold text-[#F8F8F8]">AI Works</h1>
              </div>
              <p className="mt-3 max-w-2xl text-xl text-[#F8F8F8] font-medium sm:mt-5">
                A collection of AI-powered solutions I've built to solve
                real-world problems and explore the potential of artificial
                intelligence in everyday applications.
              </p>
              <div className="mt-8 flex">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-[#F8F8F8] text-[#222222] hover:bg-[#F8F8F8]/90"
                    onClick={() => {
                      if (sectionRef.current) {
                        sectionRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    Explore AI Projects{" "}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Abstract background pattern */}
        <motion.div
          className="absolute inset-0 opacity-30"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 70%, rgba(248, 248, 248, 0.1) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(248, 248, 248, 0.15) 0%, transparent 40%)",
            }}
          ></div>
        </motion.div>
      </motion.div>

      {/* Projects Grid with staggered animation */}
      <div
        ref={sectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-12 md:grid-cols-2"
        >
          {aiWorksData.map((work, i) => (
            <motion.div
              key={work.id}
              custom={i}
              variants={fadeInUp}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="h-full"
              onMouseEnter={() => setHoveredCard(work.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="h-full flex flex-col overflow-hidden bg-[#222222] border-none shadow-xl">
                <div className="relative overflow-hidden">
                  {work.mediaType === "video" ? (
                    <motion.video
                      src={work.imageUrl}
                      className="aspect-video w-full object-cover transition-transform duration-700"
                      autoPlay
                      muted
                      loop
                      playsInline
                      animate={{
                        scale: hoveredCard === work.id ? 1.05 : 1,
                      }}
                    />
                  ) : (
                    <motion.img
                      src={work.imageUrl}
                      alt={work.title}
                      className="aspect-video w-full object-cover transition-transform duration-700"
                      animate={{
                        scale: hoveredCard === work.id ? 1.05 : 1,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#222222]/60" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="bg-[#F8F8F8] p-2 rounded-full">
                      <div className="text-[#222222]">
                        {getProjectIcon(work.title)}
                      </div>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold text-[#F8F8F8]">
                      {work.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <div className="mb-3">
                    <p className="text-[#F8F8F8] font-medium leading-relaxed line-clamp-3">
                      {work.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#F8F8F8]/80 hover:text-[#F8F8F8] hover:bg-transparent p-0 h-auto mt-1 flex items-center"
                      onClick={() => setActiveDescription(work)}
                    >
                      Read More <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {work.technologies?.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-[#F8F8F8]/10 text-[#F8F8F8] hover:bg-[#F8F8F8]/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* AI-Driven Solutions Impact Section */}
      <div className="bg-[#222222] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#F8F8F8] mb-4">
              AI-Driven Solutions
            </h2>
            <p className="text-xl text-[#F8F8F8]/80 max-w-3xl mx-auto">
              Each of these projects started as an idea to solve a specific
              problem. While they are still evolving, they demonstrate how AI
              can be leveraged to create practical and innovative solutions for
              everyday challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full bg-[#2A2A2A] border-none shadow-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#F8F8F8] p-3 rounded-full">
                      <Zap className="h-6 w-6 text-[#222222]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[#F8F8F8]">
                      Rapid Prototyping
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#F8F8F8]/80 leading-relaxed">
                    Using AI tools to quickly build functional prototypes and
                    test ideas without extensive development time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full bg-[#2A2A2A] border-none shadow-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#F8F8F8] p-3 rounded-full">
                      <Brain className="h-6 w-6 text-[#222222]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[#F8F8F8]">
                      Practical AI
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#F8F8F8]/80 leading-relaxed">
                    Building solutions that apply AI capabilities to solve
                    real-world problems and enhance everyday tasks.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full bg-[#2A2A2A] border-none shadow-xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#F8F8F8] p-3 rounded-full">
                      <Sparkles className="h-6 w-6 text-[#222222]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[#F8F8F8]">
                      Innovation
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#F8F8F8]/80 leading-relaxed">
                    Exploring creative applications of AI technologies to push
                    boundaries and discover new possibilities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Collaboration Call-to-Action Section */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#111111] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-[#F8F8F8] mb-6">
              Interested in AI collaboration?
            </h2>
            <p className="text-xl text-[#F8F8F8]/80 max-w-5xl mx-auto mb-8 whitespace-nowrap">
              Let's explore how we can leverage AI to solve your challenges and
              create innovative solutions together.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="inline-flex items-center px-8 py-4 text-lg font-medium bg-[#F8F8F8] text-[#222222] hover:bg-[#F8F8F8]/90"
                onClick={() => (window.location.href = "/contact")}
              >
                Start a Conversation <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Full description modal */}
      <AnimatePresence>
        {activeDescription && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setActiveDescription(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <div
                className="relative bg-[#222222] rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start p-5 border-b border-[#F8F8F8]/10">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F8F8F8]">
                    {activeDescription.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#F8F8F8]/70 hover:text-[#F8F8F8]"
                    onClick={() => setActiveDescription(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-5 overflow-y-auto flex-1">
                  <div className="flex items-center mb-4 flex-wrap gap-2">
                    {activeDescription.technologies?.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-[#F8F8F8]/10 text-[#F8F8F8] hover:bg-[#F8F8F8]/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="my-4">
                    <div className="aspect-video overflow-hidden rounded-lg bg-[#1A1A1A]/50 relative">
                      {activeDescription.mediaType === "video" ? (
                        <video
                          src={activeDescription.imageUrl}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                        />
                      ) : (
                        <img
                          src={activeDescription.imageUrl}
                          alt={activeDescription.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-3 left-3 bg-[#F8F8F8] p-2 rounded-full">
                        <div className="text-[#222222]">
                          {getProjectIcon(activeDescription.title)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#F8F8F8] font-medium leading-relaxed">
                    {activeDescription.description}
                  </p>
                </div>
                <div className="p-4 border-t border-[#F8F8F8]/10 flex justify-end">
                  <Button
                    variant="default"
                    className="bg-[#F8F8F8] text-[#222222] hover:bg-[#F8F8F8]/90"
                    onClick={() => setActiveDescription(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
