"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        ghost: "bg-muted/50 text-muted-foreground hover:bg-muted",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
      },
      size: {
        default: "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        sm: "rounded-full px-2 py-0.5 text-xs font-medium",
        lg: "rounded-full px-3 py-1 text-sm font-semibold",
        xl: "rounded-full px-4 py-1.5 text-base font-semibold",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md",
        pill: "rounded-[20px]",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
      animation: "none",
      interactive: false,
    },
  }
)

export interface CustomBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  dismissible?: boolean
  onDismiss?: () => void
}

export function CustomBadge({
  className,
  variant,
  size,
  shape,
  animation,
  interactive,
  icon,
  iconPosition = "left",
  dismissible = false,
  onDismiss,
  children,
  ...props
}: CustomBadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, shape, animation, interactive }),
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}
      {dismissible && (
        <button
          type="button"
          className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-background/20 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss?.()
          }}
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
} 