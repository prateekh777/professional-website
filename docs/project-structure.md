# Next.js 13+ Project Structure Guide

This document outlines the recommended folder structure for our Next.js 13+ project using the App Router, TypeScript, TailwindCSS, and shadcn/ui components.

## Root Directory Structure 
├── app/ # Main application code with App Router
├── components/ # Reusable UI components
├── lib/ # Utility functions and shared code
├── public/ # Static assets
├── styles/ # Global styles (if not in app/globals.css)
├── types/ # TypeScript type definitions
├── .env.example # Example environment variables
├── .env.local # Local environment variables (gitignored)
├── .eslintrc.json # ESLint configuration
├── .gitignore # Git ignore file
├── next.config.js # Next.js configuration
├── package.json # Project dependencies and scripts
├── postcss.config.js # PostCSS configuration
├── README.md # Project documentation
├── tailwind.config.js # Tailwind CSS configuration
├── theme.json # Theme configuration
├── tsconfig.json # TypeScript configuration
└── vercel.json # Vercel deployment configuration

## App Directory Structure (App Router)

app/
├── (auth)/ # Auth group (layout shared across auth pages)
│ ├── login/ # Login route
│ │ └── page.tsx # Login page component
│ ├── register/ # Register route
│ │ └── page.tsx # Register page component
│ ├── forgot-password/ # Forgot password route
│ │ └── page.tsx # Forgot password page component
│ └── layout.tsx # Shared layout for auth pages
├── about/ # About route
│ └── page.tsx # About page component
├── api/ # API routes
│ ├── contact/ # Contact API route
│ │ └── route.ts # Contact form handler
│ └── [...other-api]/ # Other API routes
├── contact/ # Contact route
│ └── page.tsx # Contact page component
├── projects/ # Projects route
│ └── page.tsx # Projects page component
├── favicon.ico # Favicon
├── globals.css # Global styles
├── layout.tsx # Root layout (applied to all pages)
└── page.tsx # Home page

## Components Directory Structure

components/
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── dropdown-menu.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   └── ...
├── layout/                 # Layout components
│   ├── footer.tsx          # Footer component
│   └── navigation.tsx      # Navigation component
├── forms/                  # Form components
│   ├── contact-form.tsx
│   └── ...
├── cards/                  # Card components
│   ├── project-card.tsx
│   └── ...
├── sections/               # Page section components
│   ├── hero-section.tsx
│   ├── features-section.tsx
│   └── ...
├── theme-provider.tsx      # Theme provider component
└── mode-toggle.tsx         # Dark/light mode toggle

## Public Directory Structure

public/
├── images/                 # Image assets
│   ├── hero.jpg
│   ├── projects/
│   │   ├── project1.jpg
│   │   └── ...
│   └── ...
├── fonts/                  # Custom fonts (if not using Google Fonts)
├── favicon.ico             # Favicon (alternative location)
└── robots.txt              # Robots file for SEO

## Lib Directory Structure

lib/
├── utils.ts                # Utility functions
├── hooks/                  # Custom React hooks
│   ├── use-toast.ts
│   └── ...
└── api/                    # API client functions
    ├── contact.ts
    └── ...

## Best Practices

### Routing
- Each route should have its own directory in the `app` folder
- Use `page.tsx` to make a route publicly accessible
- Use `layout.tsx` for shared layouts
- Group related routes using parentheses notation `(group-name)`

### Components
- Keep components small and focused on a single responsibility
- Use the `ui/` directory for shadcn/ui components
- Organize components by their function (layout, forms, cards, etc.)
- Use client components (`"use client"`) only when necessary

### Data Fetching
- Prefer server components for data fetching
- Use React Server Components (RSC) for most components
- Add `"use client"` directive only when you need client-side interactivity

### Styling
- Use TailwindCSS for styling
- Keep global styles in `app/globals.css`
- Use CSS variables for theming
- Follow the theme configuration in `theme.json`

### TypeScript
- Define shared types in the `types/` directory
- Use TypeScript interfaces for component props
- Leverage TypeScript's type inference when possible

### API Routes
- Create API routes in the `app/api` directory
- Use the `route.ts` file with HTTP method handlers (GET, POST, etc.)
- Keep API logic separate from UI components

## File Naming Conventions

- Use kebab-case for directories and files: `contact-form.tsx`
- Use PascalCase for React components: `export default function ContactForm()`
- Use camelCase for variables, functions, and instances
- Add `.server` or `.client` suffix for explicit server/client components (optional)

## Deployment

This project is configured for deployment on Vercel. The configuration is in `vercel.json`.