import { MongoDBStorage } from './storage';

/**
 * Singleton instance of the MongoDB storage class
 * 
 * This ensures that we only create one instance of the storage class
 * throughout the application, which helps with connection pooling
 * and overall performance.
 */

// Create a singleton instance of the storage class
const storageInstance = new MongoDBStorage();

// Export the singleton instance
export default storageInstance; 