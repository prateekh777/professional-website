import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
        card: "bg-card text-card-foreground",
      },
      padding: {
        default: "py-12 md:py-16",
        none: "py-0",
        sm: "py-6 md:py-8",
        lg: "py-16 md:py-24",
        xl: "py-24 md:py-32",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ variant, padding, className }))}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section, sectionVariants } 