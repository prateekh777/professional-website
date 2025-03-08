"use client"

import { useEffect, useState } from "react";

export function FontChecker() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if document is available (client-side)
    if (typeof document !== "undefined") {
      // Use the document.fonts API if available
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          // Check if Aeonik is loaded
          const aeonikLoaded = Array.from(document.fonts).some(
            font => font.family.includes('Aeonik') && font.status === 'loaded'
          );
          setFontsLoaded(aeonikLoaded);
          
          if (!aeonikLoaded) {
            console.warn('Aeonik font may not be loaded correctly');
          }
        });
      } else {
        // Fallback for browsers that don't support document.fonts
        // Just assume fonts are loaded after a short delay
        const timer = setTimeout(() => {
          setFontsLoaded(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // This component doesn't render anything visible
  // It's just for tracking font loading status
  return null;
} 