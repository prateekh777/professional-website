"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const carouselVariants = cva(
  "relative w-full overflow-hidden",
  {
    variants: {
      variant: {
        default: "rounded-lg border bg-card",
        borderless: "rounded-lg",
        flat: "",
      },
      size: {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-full",
      },
      navigation: {
        none: "",
        arrows: "",
        dots: "",
        both: "",
      },
      autoplay: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "full",
      navigation: "both",
      autoplay: "false",
    },
  }
)

export interface CarouselDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  items: React.ReactNode[]
  itemsPerView?: number
  spacing?: number
  autoplayInterval?: number
  loop?: boolean
  draggable?: boolean
  showArrows?: boolean
  showDots?: boolean
  arrowPosition?: 'inside' | 'outside' | 'sides'
  arrowSize?: 'sm' | 'md' | 'lg'
  dotPosition?: 'inside' | 'outside'
  dotVariant?: 'circle' | 'line' | 'square'
  effect?: 'slide' | 'fade' | 'zoom'
  aspectRatio?: string
  responsive?: boolean
  onSlideChange?: (index: number) => void
}

export function CarouselDisplay({
  className,
  variant,
  size,
  navigation,
  autoplay: autoplayProp,
  items,
  itemsPerView = 1,
  spacing = 16,
  autoplayInterval = 5000,
  loop = true,
  draggable = true,
  showArrows = true,
  showDots = true,
  arrowPosition = 'inside',
  arrowSize = 'md',
  dotPosition = 'inside',
  dotVariant = 'circle',
  effect = 'slide',
  aspectRatio,
  responsive = true,
  onSlideChange,
  ...props
}: CarouselDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [autoplay, setAutoplay] = useState(autoplayProp === 'true')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const slideContainerRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const totalSlides = items.length
  const maxIndex = Math.max(0, Math.ceil(totalSlides / itemsPerView) - 1)
  
  // Calculate dimensions
  const getItemWidth = useCallback(() => {
    if (!containerRef.current) return 0
    const containerWidth = containerRef.current.offsetWidth
    const totalSpacing = spacing * (itemsPerView - 1)
    return (containerWidth - totalSpacing) / itemsPerView
  }, [itemsPerView, spacing])
  
  // Handle navigation
  const goToSlide = useCallback((index: number) => {
    let newIndex = index
    
    if (loop) {
      if (index < 0) newIndex = maxIndex
      if (index > maxIndex) newIndex = 0
    } else {
      if (index < 0) newIndex = 0
      if (index > maxIndex) newIndex = maxIndex
    }
    
    setCurrentIndex(newIndex)
    onSlideChange?.(newIndex)
    
    // Reset autoplay timer
    if (autoplay && autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
      startAutoplay()
    }
  }, [loop, maxIndex, autoplay, onSlideChange])
  
  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])
  
  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])
  
  // Autoplay functionality
  const startAutoplay = useCallback(() => {
    if (autoplay) {
      autoplayTimerRef.current = setTimeout(() => {
        nextSlide()
      }, autoplayInterval)
    }
  }, [autoplay, autoplayInterval, nextSlide])
  
  useEffect(() => {
    startAutoplay()
    
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [startAutoplay, currentIndex])
  
  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
    }
  }
  
  const handleMouseLeave = () => {
    startAutoplay()
  }
  
  // Drag functionality
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!draggable) return
    
    setIsDragging(true)
    
    if ('touches' in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }
    
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
    }
  }
  
  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !draggable) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const offset = clientX - dragStartX
    
    setDragOffset(offset)
  }
  
  const handleDragEnd = () => {
    if (!isDragging || !draggable) return
    
    setIsDragging(false)
    
    // Determine if we should navigate based on drag distance
    const threshold = 50 // Minimum drag distance to trigger navigation
    
    if (dragOffset > threshold) {
      prevSlide()
    } else if (dragOffset < -threshold) {
      nextSlide()
    }
    
    setDragOffset(0)
    startAutoplay()
  }
  
  // Calculate transform based on current index and drag offset
  const getTransform = () => {
    const itemWidth = getItemWidth()
    const baseTransform = -currentIndex * (itemWidth + spacing) * itemsPerView
    
    return {
      transform: `translateX(${baseTransform + dragOffset}px)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
    }
  }
  
  // Render slides
  const renderSlides = () => {
    return items.map((item, index) => (
      <div
        key={index}
        className={cn(
          "shrink-0",
          effect === 'fade' && "absolute inset-0 transition-opacity duration-500",
          effect === 'zoom' && "transition-transform duration-500 origin-center"
        )}
        style={{
          width: effect === 'slide' ? `${getItemWidth()}px` : '100%',
          marginRight: effect === 'slide' ? `${spacing}px` : 0,
          opacity: effect === 'fade' ? (Math.floor(index / itemsPerView) === currentIndex ? 1 : 0) : 1,
          transform: effect === 'zoom' 
            ? `scale(${Math.floor(index / itemsPerView) === currentIndex ? 1 : 0.9})`
            : undefined,
          zIndex: effect === 'fade' ? (Math.floor(index / itemsPerView) === currentIndex ? 10 : 0) : undefined,
        }}
      >
        {item}
      </div>
    ))
  }
  
  // Render navigation dots
  const renderDots = () => {
    if (!showDots) return null
    
    return (
      <div 
        className={cn(
          "flex items-center justify-center gap-2 z-10",
          dotPosition === 'inside' ? "absolute bottom-4 left-0 right-0" : "mt-4"
        )}
      >
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              "transition-all focus:outline-none",
              dotVariant === 'circle' && "rounded-full",
              dotVariant === 'square' && "rounded-sm",
              dotVariant === 'line' && "rounded-none h-1",
              index === currentIndex
                ? "bg-primary w-3 h-3"
                : "bg-muted-foreground/30 w-2 h-2",
              dotVariant === 'line' && index === currentIndex
                ? "w-6"
                : dotVariant === 'line'
                ? "w-4"
                : ""
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )
  }
  
  // Render navigation arrows
  const renderArrows = () => {
    if (!showArrows) return null
    
    const arrowClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }[arrowSize]
    
    const positionClasses = {
      inside: "absolute top-1/2 transform -translate-y-1/2 z-10",
      outside: "absolute top-1/2 transform -translate-y-1/2 z-10",
      sides: "fixed top-1/2 transform -translate-y-1/2 z-10",
    }[arrowPosition]
    
    const leftPositionClass = {
      inside: "left-2",
      outside: "-left-12",
      sides: "left-4",
    }[arrowPosition]
    
    const rightPositionClass = {
      inside: "right-2",
      outside: "-right-12",
      sides: "right-4",
    }[arrowPosition]
    
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            positionClasses,
            leftPositionClass,
            arrowClasses,
            "rounded-full bg-background/80 backdrop-blur-sm",
            (!loop && currentIndex === 0) && "opacity-50 cursor-not-allowed"
          )}
          onClick={prevSlide}
          disabled={!loop && currentIndex === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={cn(
            positionClasses,
            rightPositionClass,
            arrowClasses,
            "rounded-full bg-background/80 backdrop-blur-sm",
            (!loop && currentIndex === maxIndex) && "opacity-50 cursor-not-allowed"
          )}
          onClick={nextSlide}
          disabled={!loop && currentIndex === maxIndex}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </>
    )
  }
  
  return (
    <div
      ref={containerRef}
      className={cn(
        carouselVariants({ variant, size, navigation, autoplay: autoplayProp }),
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        aspectRatio: aspectRatio,
      }}
      {...props}
    >
      <div
        ref={slideContainerRef}
        className={cn(
          "flex",
          effect === 'fade' && "relative h-full",
          effect === 'slide' && "transition-transform"
        )}
        style={effect === 'slide' ? getTransform() : undefined}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {renderSlides()}
      </div>
      
      {renderArrows()}
      {renderDots()}
    </div>
  )
} 