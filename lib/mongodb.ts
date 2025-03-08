import { MongoClient, Db, Collection, ServerApiVersion } from 'mongodb';
import { serverEnv } from './env';

/**
 * MongoDB Connection Utility
 * 
 * Handles connection pooling, error handling, and reconnection logic for MongoDB
 */

// Connection options
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Maximum number of connections in the connection pool
  minPoolSize: 5,  // Minimum number of connections in the connection pool
  maxIdleTimeMS: 30000, // How long a connection can remain idle before being removed from the pool
  connectTimeoutMS: 10000, // How long to wait for a connection to be established
  socketTimeoutMS: 45000, // How long to wait for a response from MongoDB
};

// Connection state
let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let connectionPromise: Promise<Db> | null = null;

// Maximum number of reconnection attempts
const MAX_RECONNECT_ATTEMPTS = 5;
// Initial reconnection delay in milliseconds
const INITIAL_RECONNECT_DELAY = 1000;

/**
 * Connect to MongoDB
 * 
 * This function handles connection pooling and reconnection logic
 */
export async function connectToMongoDB(): Promise<Db> {
  // If we're already connected, return the existing database connection
  if (db) {
    return db;
  }

  // If we're in the process of connecting, return the existing promise
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // Set connecting flag
  isConnecting = true;

  // Create a new connection promise
  connectionPromise = new Promise<Db>(async (resolve, reject) => {
    try {
      // Validate that the MongoDB URI is set
      if (!serverEnv.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      // Create a new MongoDB client
      client = new MongoClient(serverEnv.MONGODB_URI, options);

      // Connect to the MongoDB server
      await client.connect();

      // Get the database (using "PersonalPortfolio" as the database name)
      db = client.db("PersonalPortfolio");

      console.log('Connected to MongoDB');

      // Set up event listeners for the client
      client.on('close', handleDisconnect);
      client.on('error', handleError);

      // Reset connecting flag
      isConnecting = false;

      // Resolve with the database connection
      resolve(db);
    } catch (error) {
      // Reset connecting flag
      isConnecting = false;

      // Log the error
      console.error('Error connecting to MongoDB:', error);

      // Reject with the error
      reject(error);
    }
  });

  return connectionPromise;
}

/**
 * Handle disconnection from MongoDB
 */
async function handleDisconnect() {
  console.log('Disconnected from MongoDB');

  // Reset the database and client
  db = null;
  client = null;
  isConnecting = false;
  connectionPromise = null;

  // Attempt to reconnect
  await reconnect();
}

/**
 * Handle MongoDB connection errors
 */
async function handleError(error: Error) {
  console.error('MongoDB connection error:', error);

  // Reset the database and client
  db = null;
  client = null;
  isConnecting = false;
  connectionPromise = null;

  // Attempt to reconnect
  await reconnect();
}

/**
 * Attempt to reconnect to MongoDB with exponential backoff
 */
async function reconnect(attempt = 1) {
  // If we've exceeded the maximum number of reconnection attempts, give up
  if (attempt > MAX_RECONNECT_ATTEMPTS) {
    console.error(`Failed to reconnect to MongoDB after ${MAX_RECONNECT_ATTEMPTS} attempts`);
    return;
  }

  // Calculate the delay using exponential backoff
  const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, attempt - 1);

  console.log(`Attempting to reconnect to MongoDB (attempt ${attempt} of ${MAX_RECONNECT_ATTEMPTS}) in ${delay}ms`);

  // Wait for the delay
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    // Attempt to reconnect
    await connectToMongoDB();
    console.log('Successfully reconnected to MongoDB');
  } catch (error) {
    // If reconnection fails, try again
    await reconnect(attempt + 1);
  }
}

/**
 * Get a collection from the database with proper typing
 */
export async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToMongoDB();
  return database.collection<T>(collectionName);
}

/**
 * Close the MongoDB connection
 */
export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    client = null;
    isConnecting = false;
    connectionPromise = null;
    console.log('MongoDB connection closed');
  }
} 