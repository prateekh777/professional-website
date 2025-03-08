import Link from 'next/link'
import { Container } from './ui/container'
import { Grid } from './ui/grid'
import { Heading } from './ui/heading'
import { Text } from './ui/text'
import { Separator } from './ui/separator'
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Instagram', href: '#', icon: Instagram },
  ]
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ]
  
  return (
    <footer className="w-full border-t border-border mt-auto bg-muted/30">
      <Container padding="lg">
        <Grid cols={4} gap="lg">
          <div className="col-span-4 md:col-span-1">
            <Heading level="h3" className="mb-4">Professional</Heading>
            <Text variant="muted" className="max-w-xs">
              A professional website built with Next.js, TypeScript, TailwindCSS, and shadcn/ui components.
            </Text>
          </div>
          
          <div className="col-span-4 md:col-span-1">
            <Heading level="h3" className="mb-4">Links</Heading>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-4 md:col-span-1">
            <Heading level="h3" className="mb-4">Social</Heading>
            <ul className="space-y-2">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          
          <div className="col-span-4 md:col-span-1">
            <Heading level="h3" className="mb-4">Contact</Heading>
            <address className="not-italic space-y-2">
              <Text variant="muted">San Francisco, CA</Text>
              <Text variant="muted">Email: contact@example.com</Text>
              <Text variant="muted">Phone: +1 (555) 123-4567</Text>
            </address>
          </div>
        </Grid>
        
        <Separator className="my-8" />
        
        <div className="text-center">
          <Text variant="muted" size="sm">
            © {currentYear} Professional. All rights reserved.
          </Text>
        </div>
      </Container>
    </footer>
  )
} 