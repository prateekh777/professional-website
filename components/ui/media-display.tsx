"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export type MediaType = 'image' | 'video' | 'embed'

export interface MediaDisplayProps {
  src: string
  alt?: string
  type?: MediaType
  width?: number
  height?: number
  className?: string
  containerClassName?: string
  priority?: boolean
  fallbackSrc?: string
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9'
  objectFit?: 'contain' | 'cover' | 'fill'
  showControls?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function MediaDisplay({
  src,
  alt = 'Media content',
  type = 'image',
  width = 800,
  height = 600,
  className,
  containerClassName,
  priority = false,
  fallbackSrc = '/images/placeholder.jpg',
  aspectRatio = '16:9',
  objectFit = 'cover',
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = true,
  onLoad,
  onError,
}: MediaDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Calculate aspect ratio padding
  const aspectRatioPadding = {
    '1:1': 'pb-[100%]',
    '4:3': 'pb-[75%]',
    '16:9': 'pb-[56.25%]',
    '21:9': 'pb-[42.85%]',
  }[aspectRatio]
  
  // Object fit class
  const objectFitClass = {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'fill': 'object-fill',
  }[objectFit]
  
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }
  
  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }
  
  // Render media based on type
  const renderMedia = () => {
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-muted p-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Failed to load media
          </p>
        </div>
      )
    }
    
    switch (type) {
      case 'image':
        return (
          <>
            {isLoading && (
              <Skeleton className="absolute inset-0 rounded-md" />
            )}
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={cn(
                'rounded-md transition-opacity duration-300',
                objectFitClass,
                isLoading ? 'opacity-0' : 'opacity-100',
                className
              )}
              priority={priority}
              onLoad={handleLoad}
              onError={handleError}
            />
          </>
        )
      
      case 'video':
        return (
          <>
            {isLoading && (
              <Skeleton className="absolute inset-0 rounded-md" />
            )}
            <video
              src={src}
              controls={showControls}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              className={cn(
                'rounded-md w-full h-full transition-opacity duration-300',
                objectFitClass,
                isLoading ? 'opacity-0' : 'opacity-100',
                className
              )}
              onLoadedData={handleLoad}
              onError={handleError}
            />
          </>
        )
      
      case 'embed':
        return (
          <>
            {isLoading && (
              <Skeleton className="absolute inset-0 rounded-md" />
            )}
            <iframe
              src={src}
              className={cn(
                'rounded-md w-full h-full border-0 transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100',
                className
              )}
              allowFullScreen
              onLoad={handleLoad}
              onError={handleError}
            />
          </>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-md',
        aspectRatioPadding,
        containerClassName
      )}
    >
      {renderMedia()}
    </div>
  )
} 