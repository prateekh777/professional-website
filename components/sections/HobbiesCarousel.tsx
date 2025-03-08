import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import './HobbiesCarousel.css';

interface HobbyItem {
  id: number;
  imageUrl: string;
  title: string;
}

// List of hobbies with their images using the provided S3 URLs
const HOBBIES: HobbyItem[] = [
  {
    id: 1,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Hiking+Prateek.jpg',
    title: 'Hiking Adventures'
  },
  {
    id: 2,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Prateek+Badminton.jpg',
    title: 'Badminton Tournaments'
  },
  {
    id: 3,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Prateek+Bow+and+Arrow!.jpg',
    title: 'Archery Practice'
  },
  {
    id: 4,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Prateek+Marathon.gif',
    title: 'Marathon Running'
  },
  {
    id: 5,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Prateek+Paint.jpg',
    title: 'Artistic Exploration'
  },
  {
    id: 6,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Prateek+Travel.jpg',
    title: 'World Travel'
  },
  {
    id: 7,
    imageUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Hiking+Prateek_3.jpg',
    title: 'Mountain Trekking'
  }
];

export function HobbiesCarousel() {
  const [api, setApi] = useState<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const autoplayRef = useRef<number | null>(null);
  
  // Function to scroll to the next slide
  const scrollNext = () => {
    if (api) {
      // With loop:true in the carousel options, this will automatically loop back to the first slide
      // if we're at the end, but we're adding this check for additional robustness
      const canScrollNext = api.canScrollNext();
      if (canScrollNext) {
        api.scrollNext();
      } else {
        // If we're at the last slide and can't scroll next, go back to the first slide
        api.scrollTo(0);
      }
    }
  };
  
  // Auto-scroll effect that's paused when hovering
  useEffect(() => {
    if (api) {
      // Clear any existing interval when api changes or component unmounts
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      
      // Only start auto-scrolling if not hovering
      if (!isHovering) {
        autoplayRef.current = window.setInterval(() => {
          scrollNext();
        }, 3000); // Change slide every 3 seconds
      }
      
      // Cleanup function to clear interval when component unmounts or dependencies change
      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
      };
    }
  }, [api, isHovering]);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="w-full py-8 sm:py-12" style={{ background: 'rgba(150, 140, 120, 0.05)' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-[#222222]">
          Leisure & Recreation
        </h2>
        <div className="max-w-2xl mx-auto mb-6 text-center">
          <p className="text-xs sm:text-sm text-[#222222] mb-4">
            Beyond the professional sphere, I find joy and balance in a variety of recreational activities 
            that fuel my creativity and keep me grounded. These pursuits provide fresh perspectives 
            that often translate back into my work and life philosophy.
          </p>
        </div>
        
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="auto-sliding-carousel"
        >
          <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {HOBBIES.map((hobby) => (
                <CarouselItem key={hobby.id} className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <div className="hobby-card aspect-[3/4] rounded-md shadow-sm">
                      {/* Color overlay filter - lighter blur with theme colors */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-b from-[#22222215] to-[#22222245] z-10 rounded-md"
                      />
                      <img 
                        src={hobby.imageUrl} 
                        alt={hobby.title}
                        className={`hobby-image rounded-md ${loadedImages[hobby.id] ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transition: 'opacity 0.5s ease-in-out' }}
                        onLoad={() => {
                          setLoadedImages(prev => ({ ...prev, [hobby.id]: true }));
                        }}
                        onError={(e) => {
                          console.error(`Failed to load image for ${hobby.title}`);
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x500?text=${encodeURIComponent(hobby.title)}`;
                        }}
                      />
                      {!loadedImages[hobby.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                        </div>
                      )}
                      <div className="hobby-overlay rounded-b-md">
                        <h3 className="hobby-title text-xs sm:text-sm">{hobby.title}</h3>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex left-4 sm:left-6 hobby-carousel-button" />
            <CarouselNext className="hidden sm:flex right-4 sm:right-6 hobby-carousel-button" />
          </Carousel>
        </div>
      </div>
    </div>
  );
} 