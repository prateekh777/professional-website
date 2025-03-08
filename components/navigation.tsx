"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { Container } from './ui/container'
import { Flex } from './ui/flex'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

export function Navigation() {
  // Return null to prevent rendering this component
  return null;
  
  // Original code commented out below
  /*
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path
  }
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ]
  
  return (
    <header className="w-full border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container padding="none" className="py-4">
        <Flex justify="between" align="center">
          <Flex align="center" gap="lg">
            <Link href="/" className="text-2xl font-bold">
              Professional
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Flex>
          
          <Flex align="center" gap="md">
            <ModeToggle />
            
            <div className="hidden md:block">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
            
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        isActive(link.href) ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/auth/login" className="mt-4">
                    <Button className="w-full">
                      Login
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </Flex>
        </Flex>
      </Container>
    </header>
  )
  */
} 