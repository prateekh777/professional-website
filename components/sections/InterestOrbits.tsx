import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import './InterestOrbits.css';

// Define interest category types
type InterestCategory = 'startups' | 'science' | 'spirituality';

// Define the interest data structure
interface InterestItem {
  id: number;
  title: string;
  description: string;
  mediaUrl: string; 
  mediaType?: 'image' | 'video'; // Default is image if not specified
}

// Hardcoded data for each category with the provided S3 URLs
const INTERESTS_DATA: Record<InterestCategory, InterestItem[]> = {
  startups: [
    { id: 1, title: 'Awards Building Edtech', description: 'When you win it fully!', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Startups/BC+Award_2.jpg', mediaType: 'image' },
    { id: 2, title: 'Some more Edtech', description: 'Creating new opportunities', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Startups/BC+Award.jpg', mediaType: 'image' },
    { id: 3, title: 'Blitz scale it with passion', description: 'Speed matters', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Expertise/Description/BC+Video.mp4', mediaType: 'video' },
    { id: 10, title: 'Love it when you do it', description: 'Education for all', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Startups/Edoflip+Speech.mp4', mediaType: 'video' },
    { id: 13, title: 'For the Climate', description: 'For everyones Future', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Startups/Public+Speaking+Greetude.jpg', mediaType: 'image' },
    { id: 14, title: 'Helping Startup Ecosystem', description: 'Learn and share at the same time', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Startups/Startup+India+Prateek.jpg', mediaType: 'image' },
  ],
  science: [
    { id: 4, title: 'Chemistry at Play', description: 'On Stage for Kids', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Science/Prateek+Chemistry.jpg', mediaType: 'image' },
    { id: 5, title: 'Observations evaluated', description: 'The WoW effect!', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Science/Prateek+Teaching.mp4', mediaType: 'video' },
    { id: 6, title: 'Planets and Planeteriums!', description: 'Always wondered about the larger universe!', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Science/Science+Prateek.jpg', mediaType: 'image' },
    { id: 11, title: 'How to Wonder', description: 'Exploring mysteries together', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Science/Speaker+KPS.jpg', mediaType: 'image' },
  ],
  spirituality: [
    { id: 7, title: 'Art of Living Practice', description: 'Finding inner peace through community', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Meditation/Art+of+Living+Prateek.jpg', mediaType: 'image' },
    { id: 8, title: 'Nature Connection', description: 'Hiking as a form of moving meditation', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Meditation/Hiking+Prateek_2.jpg', mediaType: 'image' },
    { id: 9, title: 'Mountain Reflection', description: 'Finding clarity in natural surroundings', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Meditation/Hiking+Prateek_4.jpg', mediaType: 'image' },
    { id: 12, title: 'Meditation Practice', description: 'Daily mindfulness rituals', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Meditation/Meditating+Prateek.jpg', mediaType: 'image' },
    { id: 15, title: 'Service & Volunteering', description: 'Giving back to the community', mediaUrl: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Meditation/Prateek+Volunteering.jpg', mediaType: 'image' },
  ],
};

// More reliable placeholder images with sizes optimized for our component
const PLACEHOLDER_IMAGES: Record<InterestCategory | 'central', string> = {
  central: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Hobbies/Main+image.jpg',
  startups: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Startups/Startup+India+Prateek.jpg',
  science: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Science/Prateek+Chemistry.jpg',
  spirituality: 'https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Meditation/Meditating+Prateek.jpg',
};

export function InterestOrbits() {
  const [activeCategory, setActiveCategory] = useState<InterestCategory | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [loadedCarouselItems, setLoadedCarouselItems] = useState<Record<number, boolean>>({});
  
  const handleOpenCategory = (category: InterestCategory) => {
    setActiveCategory(category);
  };

  const handleCloseDialog = () => {
    setActiveCategory(null);
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const handleCarouselItemLoad = (id: number) => {
    setLoadedCarouselItems(prev => ({ ...prev, [id]: true }));
  };

  // Add useEffect to handle video autoplay when dialog opens
  useEffect(() => {
    if (activeCategory) {
      // Small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        const videos = document.querySelectorAll('.interest-dialog-content video') as NodeListOf<HTMLVideoElement>;
        videos.forEach(video => {
          video.play().catch(err => {
            console.log('Autoplay prevented:', err);
            // Add play button or other fallback if needed
          });
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [activeCategory]);

  return (
    <>
      <div className="relative w-full h-[450px] sm:h-[500px] flex items-center justify-center overflow-hidden" 
        style={{ background: 'rgba(150, 140, 120, 0.05)' }}>
        {/* Main central circle */}
        <div 
          className="absolute z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full shadow-md orbit-item clickable-pulse"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="orbit-content">
            <div className="orbit-image-container">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden relative">
                {!loadedImages['central'] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={PLACEHOLDER_IMAGES.central}
                  alt="Central" 
                  className={`w-full h-full object-cover ${loadedImages['central'] ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transition: 'opacity 0.3s ease-in-out' }}
                  onLoad={() => handleImageLoad('central')}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Interests';
                    handleImageLoad('central');
                  }}
                />
              </div>
              <div className="orbit-title text-xs sm:text-sm text-[#222222]">Interests</div>
            </div>
          </div>
        </div>
        
        {/* Orbiting circles */}
        <div className="absolute w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full border border-dashed border-[#7B7B7B]/30">
          {/* Startups orbit */}
          <div className="orbit-circle" style={{ animation: 'orbit 20s linear infinite' }}>
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md orbit-item clickable-pulse"
              onClick={() => handleOpenCategory('startups')}
              style={{ borderColor: 'rgba(46, 204, 113, 0.8)' }}
            >
              <div className="orbit-content">
                <div className="orbit-image-container">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative">
                    {!loadedImages['startups'] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img 
                      src={PLACEHOLDER_IMAGES.startups} 
                      alt="Startups" 
                      className={`w-full h-full object-cover ${loadedImages['startups'] ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transition: 'opacity 0.3s ease-in-out' }}
                      onLoad={() => handleImageLoad('startups')}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Startups';
                        handleImageLoad('startups');
                      }}
                    />
                  </div>
                  <div className="orbit-title text-[10px] sm:text-xs text-[#222222]">Startups</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Science orbit (120 degrees offset) */}
          <div className="orbit-circle" style={{ animation: 'orbit 20s linear infinite', animationDelay: '-6.66s' }}>
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md orbit-item clickable-pulse"
              onClick={() => handleOpenCategory('science')}
              style={{ borderColor: 'rgba(52, 152, 219, 0.8)' }}
            >
              <div className="orbit-content">
                <div className="orbit-image-container">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative">
                    {!loadedImages['science'] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img 
                      src={PLACEHOLDER_IMAGES.science} 
                      alt="Science" 
                      className={`w-full h-full object-cover ${loadedImages['science'] ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transition: 'opacity 0.3s ease-in-out' }}
                      onLoad={() => handleImageLoad('science')}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Science';
                        handleImageLoad('science');
                      }}
                    />
                  </div>
                  <div className="orbit-title text-[10px] sm:text-xs text-[#222222]">Science</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Spirituality orbit (240 degrees offset) */}
          <div className="orbit-circle" style={{ animation: 'orbit 20s linear infinite', animationDelay: '-13.33s' }}>
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-md orbit-item clickable-pulse"
              onClick={() => handleOpenCategory('spirituality')}
              style={{ borderColor: 'rgba(142, 68, 173, 0.8)' }}
            >
              <div className="orbit-content">
                <div className="orbit-image-container">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative">
                    {!loadedImages['spirituality'] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img 
                      src={PLACEHOLDER_IMAGES.spirituality} 
                      alt="Spirituality" 
                      className={`w-full h-full object-cover ${loadedImages['spirituality'] ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transition: 'opacity 0.3s ease-in-out' }}
                      onLoad={() => handleImageLoad('spirituality')}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Spirituality';
                        handleImageLoad('spirituality');
                      }}
                    />
                  </div>
                  <div className="orbit-title text-[10px] sm:text-xs text-[#222222]">Spirituality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Instruction text below the orbits */}
        <div className="absolute bottom-2 left-0 right-0 text-center sm:text-left sm:left-8 sm:right-auto">
          <p className="italic text-xs px-3 py-1.5 bg-white/30 backdrop-blur-[2px] inline-block rounded-full text-[#555555] border border-[#7B7B7B]/20 shadow-sm transition-opacity hover:opacity-80">
            ✨ Click on sphere to know more...
          </p>
        </div>
      </div>
        
      {/* Dialog for showing selected category images */}
      <Dialog open={activeCategory !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] max-h-[90vh] overflow-auto p-4 sm:p-6 interest-dialog-content" 
          style={{ background: '#F8F8F8', borderColor: '#222222', width: 'auto' }}>
          <DialogHeader>
            <DialogTitle className="text-xl capitalize mb-3" style={{ color: '#222222' }}>
              {activeCategory} Interests
            </DialogTitle>
          </DialogHeader>
          
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {activeCategory && INTERESTS_DATA[activeCategory].map((item) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/2 lg:basis-2/5">
                  <div className="p-1 md:p-2 h-full">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md p-2 md:p-3 h-full border border-[#7B7B7B]/10 flex flex-col">
                      <div className="aspect-square w-full overflow-hidden rounded-md mb-2 flex-shrink-0">
                        {item.mediaType === 'video' ? (
                          <div className="video-container">
                            <video 
                              src={item.mediaUrl}
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                              muted
                              loop
                              preload="metadata"
                              poster={`https://via.placeholder.com/300/222222/FFFFFF?text=${item.title}`}
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            {!loadedCarouselItems[item.id] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                              </div>
                            )}
                            <img 
                              src={item.mediaUrl} 
                              alt={item.title}
                              className={`w-full h-full object-cover transition-all hover:scale-105 ${loadedCarouselItems[item.id] ? 'opacity-100' : 'opacity-0'}`}
                              style={{ transition: 'opacity 0.3s ease-in-out' }}
                              onLoad={() => handleCarouselItemLoad(item.id)}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/300?text=${item.title}`;
                                handleCarouselItemLoad(item.id);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="pt-1 md:pt-2 flex-grow">
                        <h3 className="font-medium text-sm md:text-base mb-0.5 md:mb-1" style={{ color: '#222222' }}>{item.title}</h3>
                        <p className="text-xs md:text-sm" style={{ color: '#7B7B7B' }}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 lg:left-6 carousel-control" />
            <CarouselNext className="right-3 lg:right-6 carousel-control" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
} 