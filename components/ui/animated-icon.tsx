"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified version for build to pass
export interface AnimatedIconProps {
  className?: string
  svgPath?: string
  name?: string
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  animation?: "none" | "pulse" | "spin" | "bounce" | "ping" | "wiggle" | "wave"
  color?: string
  hover?: string
  children?: React.ReactNode
  fill?: boolean
  strokeWidth?: number
}

export function AnimatedIcon({
  className,
  svgPath,
  name,
  size = "md",
  animation = "none",
  color,
  hover,
  children,
  fill = false,
  strokeWidth = 2,
  ...props
}: AnimatedIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
  }

  const animationClasses = {
    none: "",
    pulse: "animate-pulse",
    spin: "animate-spin",
    bounce: "animate-bounce",
    ping: "animate-ping",
    wiggle: "animate-wiggle",
    wave: "animate-wave",
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        animationClasses[animation],
        className
      )}
      {...props}
    >
      {children ? (
        children
      ) : svgPath ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d={svgPath} />
        </svg>
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          {name?.charAt(0) || "?"}
        </div>
      )}
    </div>
  )
}

// Add custom animations to tailwind.config.js
// keyframes: {
//   wiggle: {
//     '0%, 100%': { transform: 'rotate(-3deg)' },
//     '50%': { transform: 'rotate(3deg)' },
//   },
//   wave: {
//     '0%': { transform: 'rotate(0deg)' },
//     '10%': { transform: 'rotate(14deg)' },
//     '20%': { transform: 'rotate(-8deg)' },
//     '30%': { transform: 'rotate(14deg)' },
//     '40%': { transform: 'rotate(-4deg)' },
//     '50%': { transform: 'rotate(10deg)' },
//     '60%': { transform: 'rotate(0deg)' },
//     '100%': { transform: 'rotate(0deg)' },
//   },
// },
// animation: {
//   wiggle: 'wiggle 1s ease-in-out infinite',
//   wave: 'wave 1.5s infinite',
// }, 