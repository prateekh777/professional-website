"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CarouselDisplayProps {
  className?: string
  children?: React.ReactNode
  size?: "sm" | "md" | "lg" | "full"
  navigation?: "dots" | "arrows" | "both" | "none"
  autoplay?: boolean
  autoplayInterval?: number
  loop?: boolean
  showArrows?: boolean
}

export function CarouselDisplay({
  className,
  children,
  size = "md",
  navigation = "dots",
  autoplay = false,
  autoplayInterval = 3000,
  loop = false,
  showArrows = true,
  ...props
}: CarouselDisplayProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const childrenArray = React.Children.toArray(children)
  
  const handleNext = React.useCallback(() => {
    if (currentIndex < childrenArray.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (loop) {
      setCurrentIndex(0)
    }
  }, [currentIndex, childrenArray.length, loop])
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (loop) {
      setCurrentIndex(childrenArray.length - 1)
    }
  }
  
  React.useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        handleNext()
      }, autoplayInterval)
      
      return () => clearInterval(interval)
    }
  }, [autoplay, autoplayInterval, handleNext])
  
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    full: "w-full",
  }
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      
      {(navigation === "dots" || navigation === "both") && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                index === currentIndex ? "bg-white" : "bg-white/50"
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {(showArrows || navigation === "arrows" || navigation === "both") && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40"
            onClick={handlePrev}
            disabled={!loop && currentIndex === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40"
            onClick={handleNext}
            disabled={!loop && currentIndex === childrenArray.length - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}
    </div>
  )
} 