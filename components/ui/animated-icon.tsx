"use client"

import React, { useState, useEffect, useRef } from 'react'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/lib/utils'

const iconVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        spin: "animate-spin",
        bounce: "animate-bounce",
        ping: "animate-ping",
        wiggle: "animate-wiggle",
        wave: "animate-wave",
      },
      color: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        accent: "text-accent",
        destructive: "text-destructive",
        success: "text-green-500",
        warning: "text-yellow-500",
        info: "text-blue-500",
      },
      hover: {
        none: "",
        grow: "hover:scale-110 transition-transform",
        shrink: "hover:scale-90 transition-transform",
        rotate: "hover:rotate-12 transition-transform",
        color: "hover:text-primary transition-colors",
      },
    },
    defaultVariants: {
      size: "md",
      animation: "none",
      color: "default",
      hover: "none",
    },
  }
)

export interface AnimatedIconProps
  extends React.SVGAttributes<SVGElement>,
    VariantProps<typeof iconVariants> {
  svgPath?: string
  lottieData?: any
  spriteId?: string
  strokeWidth?: number
  fill?: boolean
  loop?: boolean
  autoplay?: boolean
  onAnimationComplete?: () => void
}

export function AnimatedIcon({
  className,
  size,
  animation,
  color,
  hover,
  svgPath,
  lottieData,
  spriteId,
  strokeWidth = 2,
  fill = false,
  loop = true,
  autoplay = true,
  onAnimationComplete,
  ...props
}: AnimatedIconProps) {
  const lottieRef = useRef<HTMLDivElement>(null)
  const [lottieInstance, setLottieInstance] = useState<any>(null)
  
  // Load Lottie animation if lottieData is provided
  useEffect(() => {
    if (lottieData && lottieRef.current) {
      // Dynamically import Lottie to avoid SSR issues
      import('lottie-web').then((Lottie) => {
        if (lottieRef.current) {
          const instance = Lottie.default.loadAnimation({
            container: lottieRef.current,
            renderer: 'svg',
            loop,
            autoplay,
            animationData: lottieData,
          })
          
          if (onAnimationComplete) {
            instance.addEventListener('complete', onAnimationComplete)
          }
          
          setLottieInstance(instance)
          
          return () => {
            instance.destroy()
            if (onAnimationComplete) {
              instance.removeEventListener('complete', onAnimationComplete)
            }
          }
        }
      }).catch(err => {
        console.error('Failed to load Lottie animation:', err)
      })
    }
  }, [lottieData, loop, autoplay, onAnimationComplete])
  
  // Render based on the provided props
  if (lottieData) {
    return (
      <div 
        ref={lottieRef}
        className={cn(iconVariants({ size, animation, color, hover }), className)}
        {...props}
      />
    )
  }
  
  if (svgPath) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={fill ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(iconVariants({ size, animation, color, hover }), className)}
        {...props}
      >
        <path d={svgPath} />
      </svg>
    )
  }
  
  if (spriteId) {
    return (
      <svg
        className={cn(iconVariants({ size, animation, color, hover }), className)}
        {...props}
      >
        <use href={`/sprites.svg#${spriteId}`} />
      </svg>
    )
  }
  
  // Fallback to children if no specific icon source is provided
  return (
    <div className={cn(iconVariants({ size, animation, color, hover }), className)} {...props} />
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