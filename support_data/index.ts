import express from "express";
import { createServer } from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { registerRoutes } from "../server/routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express application
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup function for Vercel serverless
const setupServer = async () => {
  // Register API routes
  await registerRoutes(app);
  
  // In production, serve static files
  const distPath = path.resolve(__dirname, "../dist/public");
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Serve index.html for any routes not handled by the API
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  
  return app;
};

// Export for Vercel serverless functions
export default setupServer();