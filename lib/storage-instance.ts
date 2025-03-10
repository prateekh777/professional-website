/**
 * Storage instance for file operations
 * This is a placeholder implementation that can be replaced with actual storage logic
 */

import { AiWork, Interest } from './schemas';

const storageInstance = {
  // Placeholder method for getting files
  getFiles: async (path: string) => {
    return [];
  },
  
  // Placeholder method for getting a file
  getFile: async (path: string) => {
    return null;
  },
  
  // Placeholder method for getting AI works
  getAiWorks: async (featured?: boolean) => {
    // Return empty array as placeholder
    return [] as AiWork[];
  },
  
  // Placeholder method for getting a single AI work
  getAiWork: async (id: string) => {
    // Return null as placeholder
    return null as AiWork | null;
  },
  
  // Placeholder method for getting sections
  getSections: async (featured?: boolean) => {
    // Return empty array as placeholder
    return [];
  },
  
  // Placeholder method for getting a single section
  getSection: async (id: string) => {
    // Return null as placeholder
    return null;
  },
  
  // Placeholder method for getting interests
  getInterests: async (category?: string, featured?: boolean) => {
    // Return empty array as placeholder
    return [] as Interest[];
  },
  
  // Placeholder method for getting a single interest
  getInterest: async (id: string) => {
    // Return null as placeholder
    return null as Interest | null;
  }
};

export default storageInstance; 