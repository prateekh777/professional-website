"use client"

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timeline } from "@/components/sections/Timeline";
import { Highlights } from "@/components/sections/Highlights";

// Define the Section type if not already defined elsewhere
interface Section {
  id: string;
  title: string;
  content: string;
}

type Role =
  | "tech-leader"
  | "people-manager"
  | "individual-contributor"
  | "strategy-contributor";

export default function Expertise() {
  const [selectedRole, setSelectedRole] = useState<Role>("tech-leader");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading } = useQuery<Section[]>({
    queryKey: ["/api/sections/expertise"],
    queryFn: async () => {
      // Placeholder for actual API call
      // In a real implementation, you would fetch data from your API
      // For now, returning mock data
     
      return [];
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-16">
      {/* Added top padding to account for fixed header */}
      <h1 className="text-4xl flex items-center justify-center font-bold text-center">
        Skills Honed, Stories Told.. My Journey!
      </h1>
      
      {/* Role Selection - Made sticky with tabs instead of dropdown */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-xl font-medium mb-2">My Hats</h2>
          <h4 className="text-sm font-light mb-2">Click on the Hat below to find more</h4>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
            <button 
              onClick={() => setSelectedRole("tech-leader")}
              className={`text-sm px-6 py-3 rounded-lg transition-all font-medium ${
                selectedRole === "tech-leader" 
                  ? "bg-white text-black shadow-md transform scale-105 border-b-4 border-gray-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Product Leader
            </button>
            <button 
              onClick={() => setSelectedRole("people-manager")}
              className={`text-sm px-6 py-3 rounded-lg transition-all font-medium ${
                selectedRole === "people-manager" 
                  ? "bg-white text-black shadow-md transform scale-105 border-b-4 border-gray-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Ops - People Manager
            </button>
            <button 
              onClick={() => setSelectedRole("individual-contributor")}
              className={`text-sm px-6 py-3 rounded-lg transition-all font-medium ${
                selectedRole === "individual-contributor" 
                  ? "bg-white text-black shadow-md transform scale-105 border-b-4 border-gray-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Founder - CXO
            </button>
            <button 
              onClick={() => setSelectedRole("strategy-contributor")}
              className={`text-sm px-6 py-3 rounded-lg transition-all font-medium ${
                selectedRole === "strategy-contributor" 
                  ? "bg-white text-black shadow-md transform scale-105 border-b-4 border-gray-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Strategy and Planning
            </button>
          </div>
        </div>
      </div>
      
      {/* Timeline Section */}
      <Timeline role={selectedRole} />
      
      {/* Highlights Section */}
      <Highlights role={selectedRole} />
    </div>
  );
}
