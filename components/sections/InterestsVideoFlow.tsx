import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Note: This component requires a video file hosted at the S3 URL
// If the video is not available, it will display a fallback gradient background
export function InterestsVideoFlow() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeSection, setActiveSection] = useState<'spirituality' | 'science' | 'startups' | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Section content
  const sections = {
    spirituality: {
      title: "Spirituality",
      description: "Gives purpose and strength, forming the foundation of authentic growth. It's the inner world where consciousness expands and resilience is found.",
      color: "rgba(142, 68, 173, 0.15)",
      textColor: "rgb(122, 48, 153)",
      borderColor: "rgba(142, 68, 173, 0.3)"
    },
    science: {
      title: "Science",
      description: "Corroborates the strength, validates it and supports it. Through analysis and discovery, inner wisdom finds its outer expression.",
      color: "rgba(52, 152, 219, 0.15)",
      textColor: "rgb(32, 132, 199)",
      borderColor: "rgba(52, 152, 219, 0.3)"
    },
    startups: {
      title: "Impact Through Startups",
      description: "The actualization of the deep synthesis of Science and Spirituality leads to the expression of beauty. When inner and outer worlds combine, we produce meaningful impact.",
      color: "rgba(46, 204, 113, 0.15)",
      textColor: "rgb(26, 184, 93)",
      borderColor: "rgba(46, 204, 113, 0.3)"
    }
  };

  // Mobile version
  if (isSmallScreen) {
    return (
      <div className="w-full py-6 px-4">
        {/* The main video section */}
        <div className="relative w-full h-[250px] mb-6 rounded-lg overflow-hidden">
          {/* Static gradient background fallback - always visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-green-900/30 z-0"></div>
          
          {/* Video with error handling */}
          {!videoError ? (
            <>
              <video 
                src="https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Gen+Alpha.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover z-10"
                onError={(e) => {
                  console.error("Video error:", e);
                  setVideoError(true);
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
              <div className="text-center text-gray-200 p-2 rounded-lg">
                <p className="text-xs">Visualization in static mode</p>
              </div>
            </div>
          )}
          
          {/* Simple overlay for the video */}
          <div className="absolute bottom-2 left-0 right-0 text-center z-20">
            <p className="text-white/90 text-xs italic">
              "Spirituality → Science → Startups"
            </p>
          </div>
        </div>

        {/* Three small cards below */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(sections).map(([key, section]) => (
            <motion.div
              key={key}
              className="rounded-lg p-2 transition-all cursor-pointer"
              style={{ 
                backgroundColor: section.color,
                borderLeft: `3px solid ${section.borderColor}`,
                width: 'calc(33% - 8px)',
                minWidth: '90px'
              }}
              onClick={() => setActiveSection(activeSection === key as any ? null : key as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="font-semibold text-xs" style={{ color: section.textColor }}>{section.title}</h3>
            </motion.div>
          ))}
        </div>
        
        {/* Modal overlay for mobile view */}
        <AnimatePresence>
          {activeSection && (
            <motion.div 
              className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveSection(null)} // Close when clicking the backdrop
            >
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <motion.div 
                className="relative bg-white/95 p-5 rounded-xl mx-4 max-w-md"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the modal itself
              >
                {/* Close (X) button */}
                <button 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setActiveSection(null)}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <h3 className="text-lg font-bold mb-2 mt-1" style={{ 
                  color: activeSection === 'spirituality' ? 'rgb(142, 68, 173)' : 
                        activeSection === 'science' ? 'rgb(52, 152, 219)' : 
                        'rgb(46, 204, 113)'
                }}>
                  {sections[activeSection].title}
                </h3>
                <p className="text-gray-700 text-sm mb-4">{sections[activeSection].description}</p>
                <button 
                  className="text-xs py-1 px-3 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => setActiveSection(null)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop version with large video and small cards below
  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Large video section */}
      <div className="w-full h-[400px] relative overflow-hidden rounded-xl">
        {/* Static gradient background fallback - always visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20"></div>
        
        {/* Video with error handling */}
        {!videoError ? (
          <video 
            src="https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Interest/Gen+Alpha.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Desktop video error:", e);
              setVideoError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400 bg-black/20 p-4 rounded-lg backdrop-blur-sm">
              <p>Video visualization unavailable</p>
              <p className="text-xs mt-1">Interactive cards available below</p>
            </div>
          </div>
        )}
        
        {/* Title Overlay */}
        <motion.div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-white text-2xl font-bold mb-1">The Synthesis of Inner and Outer Worlds</h2>
          <p className="text-white/80 text-sm">A visual journey through interconnected dimensions</p>
        </motion.div>
        
        {/* Footer text */}
        <div className="absolute bottom-4 left-0 right-0 text-center z-20">
          <p className="text-white/90 text-sm italic">
            "The synthesis of inner wisdom and scientific approach creates meaningful impact through entrepreneurship."
          </p>
        </div>
      </div>
      
      {/* Three small cards in a row */}
      <div className="flex justify-center gap-6 w-full max-w-screen-lg px-4">
        {/* Spirituality */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md cursor-pointer hover:shadow-lg"
          style={{ 
            borderTop: '3px solid rgb(142, 68, 173)',
            maxWidth: '250px'
          }}
          whileHover={{ y: -3 }}
          onClick={() => setActiveSection(activeSection === 'spirituality' ? null : 'spirituality')}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-md font-bold mb-1" style={{ color: 'rgb(142, 68, 173)' }}>Spirituality</h3>
          <p className="text-xs text-gray-700">
            Gives purpose and <span className="font-semibold">inner strength</span>, forming the foundation of authentic growth.
          </p>
          
          {/* Flow indicator - small arrow pointing right */}
          <motion.div 
            className="w-full flex justify-end mt-2" 
            animate={{ 
              x: activeSection === 'spirituality' ? [0, 5, 0] : 0
            }}
            transition={{ repeat: activeSection === 'spirituality' ? Infinity : 0, duration: 1.5 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="rgb(142, 68, 173)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
        
        {/* Science */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md cursor-pointer hover:shadow-lg"
          style={{ 
            borderTop: '3px solid rgb(52, 152, 219)',
            maxWidth: '250px'
          }}
          whileHover={{ y: -3 }}
          onClick={() => setActiveSection(activeSection === 'science' ? null : 'science')}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-md font-bold mb-1" style={{ color: 'rgb(52, 152, 219)' }}>Science</h3>
          <p className="text-xs text-gray-700">
            Corroborates the strength, <span className="font-semibold">validates it and supports it</span> through analysis and discovery.
          </p>
          
          {/* Flow indicator - small arrow pointing right */}
          <motion.div 
            className="w-full flex justify-end mt-2" 
            animate={{ 
              x: activeSection === 'science' ? [0, 5, 0] : 0
            }}
            transition={{ repeat: activeSection === 'science' ? Infinity : 0, duration: 1.5 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="rgb(52, 152, 219)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
        
        {/* Startups/Impact */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md cursor-pointer hover:shadow-lg"
          style={{ 
            borderTop: '3px solid rgb(46, 204, 113)',
            maxWidth: '250px'
          }}
          whileHover={{ y: -3 }}
          onClick={() => setActiveSection(activeSection === 'startups' ? null : 'startups')}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-md font-bold mb-1" style={{ color: 'rgb(46, 204, 113)' }}>Impact Through Startups</h3>
          <p className="text-xs text-gray-700">
            The <span className="font-semibold">actualization</span> of Science and Spirituality's synthesis creates real-world impact.
          </p>
          
          {/* Final result indicator - small star */}
          <motion.div 
            className="w-full flex justify-center mt-2" 
            animate={{ scale: activeSection === 'startups' ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: activeSection === 'startups' ? Infinity : 0, duration: 1.5 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="rgb(46, 204, 113)" fillOpacity="0.5" stroke="rgb(46, 204, 113)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Flow animation overlays for when a section is active */}
      <AnimatePresence>
        {activeSection && (
          <motion.div 
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveSection(null)} // Close when clicking the backdrop
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            <motion.div 
              className="relative bg-white/95 p-6 rounded-xl max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the modal itself
            >
              {/* Close (X) button */}
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setActiveSection(null)}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <h3 className="text-xl font-bold mb-2" style={{ 
                color: activeSection === 'spirituality' ? 'rgb(142, 68, 173)' : 
                      activeSection === 'science' ? 'rgb(52, 152, 219)' : 
                      'rgb(46, 204, 113)'
              }}>
                {sections[activeSection].title}
              </h3>
              <p className="text-gray-700 mb-4">{sections[activeSection].description}</p>
              <button 
                className="text-sm py-1 px-3 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={() => setActiveSection(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 