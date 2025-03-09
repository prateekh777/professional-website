import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { contactFormSchema, sendContactEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Health check endpoint for monitoring
  app.get("/api/health", async (req, res) => {
    // Check MongoDB connection if we're using it
    let dbStatus = 'not_configured';
    
    if (process.env.MONGODB_URI) {
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        // Successfully connected
        await client.close();
        dbStatus = 'connected';
      } catch (error) {
        console.error('Health check - MongoDB connection error:', error);
        dbStatus = 'error';
      }
    }
    
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      email: process.env.SENDGRID_API_KEY ? 'configured' : 'not_configured'
    });
  });

  // Contact form - Only API endpoint we're keeping
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const contactData = contactFormSchema.parse(req.body);
      
      // Send the email
      const success = await sendContactEmail(contactData);
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Your message has been sent. I'll get back to you soon!" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send your message. Please try again later." 
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ 
        success: false, 
        message: "Invalid form data. Please check your inputs and try again." 
      });
    }
  });

  return httpServer;
}
