"use client"

import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  videoUrl: string;
}

export function HeroSection({ title, subtitle, videoUrl }: HeroSectionProps) {
  const [showScroll, setShowScroll] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Attempt to play the video
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
        setVideoError(true);
      });
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] h-[95vh] sm:h-[92vh] md:h-[88vh] lg:h-[85vh] xl:h-[82vh] 2xl:h-[78vh] w-full overflow-hidden">
      {/* Main Frame - Laptop Screen Background */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center backdrop-blur-sm">
        <img
          src="https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Homepage/laptop-frame.jpg"
          alt="Laptop Frame"
          className="opacity-90"
        />
      </div>

      {/* Video Frame - 16:9 aspect ratio, aligned to top of main frame */}
      <div
        className="relative left-1/2 top-[53%] z-0 w-[45%] -translate-x-1/2 -translate-y-[60%] shadow-xl"
        style={{
          aspectRatio: "16/8",
          transform: "translate(-50%, -60%) perspective(1000px) rotateX(5deg)",
        }}
      >
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="h-full w-full rounded-lg object-cover"
          >
            <source src="https://prateek-personal.s3.ap-south-1.amazonaws.com/Assets/Homepage/Hero+Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Overlay with softer gradient for better text contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#222222]/10 to-[#222222]/20 backdrop-blur-[2px]" />

      {/* Title and Subtitle Container with animation */}
      <div
        className="absolute left-1/2 z-20 w-[70%]"
        style={{
          top: "calc(25% + 16.875vw - 10px)",
          transform: "translate(-50%, -50%) perspective(1000px) rotateX(5deg)",
        }}
      >
        <div className="text-center relative">
          {/* Animated border accent */}
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#FFFFFF]/0 via-[#FFFFFF]/20 to-[#FFFFFF]/0 opacity-30 blur-sm"></div>
          
          <h1 className="shimmer text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-none text-[#FFFFFF] drop-shadow-md relative">
            {title}
          </h1>
          <p className="mt-4 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light tracking-wide text-[#F8F8F8] drop-shadow-md relative">
            {subtitle}
          </p>
          
          {/* Animated highlight underline */}
          <div className="h-[1px] w-[60%] mx-auto mt-6 bg-gradient-to-r from-transparent via-[#FFFFFF]/70 to-transparent"></div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator with ring effect */}
      {showScroll && (
        <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 z-20 -translate-x-1/2">
          <div className="relative flex items-center justify-center">
            {/* Pulse ring effect */}
            <div className="absolute rounded-full h-8 w-8 border border-white/40 animate-pulse-subtle"></div>
            
            {/* Arrow icon */}
            <div className="animate-bounce">
              <ArrowDown className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-[#FFFFFF] drop-shadow-md" />
            </div>
          </div>
          <p className="text-[10px] xs:text-xs text-white/70 text-center mt-1">Scroll Down</p>
        </div>
      )}
    </section>
  );
} 