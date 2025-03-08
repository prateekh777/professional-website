"use client"

import React from "react";
import Link from "next/link";

export default function AIWorks() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">AI Works</h1>
      
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg mb-8">
          This section is currently under development. Check back soon to see my AI-related projects and works!
        </p>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="mb-6">
            I'm working on showcasing some exciting AI projects and experiments here. 
            In the meantime, feel free to explore other sections of my portfolio.
          </p>
          
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
