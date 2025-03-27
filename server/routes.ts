import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    const properties = await storage.getAllProperties();
    res.json(properties);
  });

  // Get property by ID
  app.get("/api/properties/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    res.json(property);
  });

  // Get featured properties
  app.get("/api/properties/featured/list", async (req, res) => {
    const properties = await storage.getFeaturedProperties();
    res.json(properties);
  });

  // Get filtered properties
  app.get("/api/properties/search", async (req, res) => {
    const { location, propertyType, minPrice, maxPrice } = req.query;
    
    // Create the filters object
    const filters: {
      location?: string;
      propertyType?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {};
    
    if (location && typeof location === "string") {
      filters.location = location;
    }
    
    if (propertyType && typeof propertyType === "string") {
      filters.propertyType = propertyType;
    }
    
    if (minPrice && typeof minPrice === "string") {
      const parsedMinPrice = parseInt(minPrice);
      if (!isNaN(parsedMinPrice)) {
        filters.minPrice = parsedMinPrice;
      }
    }
    
    if (maxPrice && typeof maxPrice === "string") {
      const parsedMaxPrice = parseInt(maxPrice);
      if (!isNaN(parsedMaxPrice)) {
        filters.maxPrice = parsedMaxPrice;
      }
    }
    
    const properties = await storage.getPropertiesByFilters(filters);
    res.json(properties);
  });

  // Get all agents
  app.get("/api/agents", async (req, res) => {
    const agents = await storage.getAllAgents();
    res.json(agents);
  });

  // Get agent by ID
  app.get("/api/agents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }
    
    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    
    res.json(agent);
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  });

  // Submit waitlist entry
  app.post("/api/waitlist", async (req, res) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      const entry = await storage.createWaitlistEntry(waitlistData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid waitlist data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ message: "Failed to create waitlist entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
