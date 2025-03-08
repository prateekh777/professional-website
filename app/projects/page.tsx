import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Projects | Professional Website',
  description: 'Explore my portfolio of projects and work',
}

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">My Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project Card 1 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-muted relative">
              {/* Placeholder for project image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Project Image
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">E-Commerce Website</h3>
              <p className="text-muted-foreground mb-4">
                A full-featured online store built with Next.js and Stripe integration.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">Next.js</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">TypeScript</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">Stripe</span>
              </div>
              <div className="flex justify-between">
                <a href="#" className="text-primary hover:underline">View Demo</a>
                <a href="#" className="text-primary hover:underline">Source Code</a>
              </div>
            </div>
          </div>
          
          {/* Project Card 2 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-muted relative">
              {/* Placeholder for project image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Project Image
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Task Management App</h3>
              <p className="text-muted-foreground mb-4">
                A productivity app for managing tasks and projects with team collaboration.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">React</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">Firebase</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">TailwindCSS</span>
              </div>
              <div className="flex justify-between">
                <a href="#" className="text-primary hover:underline">View Demo</a>
                <a href="#" className="text-primary hover:underline">Source Code</a>
              </div>
            </div>
          </div>
          
          {/* Project Card 3 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-muted relative">
              {/* Placeholder for project image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Project Image
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">AI Content Generator</h3>
              <p className="text-muted-foreground mb-4">
                An AI-powered tool that generates content for blogs, social media, and more.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">Python</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">OpenAI</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full">FastAPI</span>
              </div>
              <div className="flex justify-between">
                <a href="#" className="text-primary hover:underline">View Demo</a>
                <a href="#" className="text-primary hover:underline">Source Code</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 