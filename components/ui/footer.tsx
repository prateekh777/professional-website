"use client"

import Link from "next/link";
import { Linkedin, Twitter, Instagram, Facebook, Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto border-t py-6 md:py-0" style={{ backgroundColor: 'rgb(240, 235, 220)' }}>
      <div className="container flex flex-col md:flex-row h-auto py-4 md:h-20 max-w-screen-xl items-center justify-between px-4">
        <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground mb-2 md:mb-0">
            © {new Date().getFullYear()} Prateek Hakay. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://prateekhakay.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
              <Globe className="h-3 w-3" />
              <span>prateekhakay.com</span>
            </a>
            <span className="text-sm text-muted-foreground">Berlin, Germany</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Social Links */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/prateekh777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com/Prateek_Hakay"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#1DA1F2] hover:text-[#1DA1F2]/80"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://www.instagram.com/prateekhakay"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#E4405F] hover:text-[#E4405F]/80"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://www.linkedin.com/in/pratikhakay/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#0A66C2] hover:text-[#0A66C2]/80"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://www.facebook.com/prateek.hakay/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#1877F2] hover:text-[#1877F2]/80"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
          </div>

          {/* Admin Link */}
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
} 