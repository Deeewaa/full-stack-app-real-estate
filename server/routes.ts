import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertMessageSchema, insertUserSchema, insertPropertySchema } from "@shared/schema";
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

  // Message API endpoints
  
  // Get messages by user
  app.get("/api/messages/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const messages = await storage.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });
  
  // Get messages between two users
  app.get("/api/messages/between/:user1Id/:user2Id", async (req, res) => {
    const user1Id = parseInt(req.params.user1Id);
    const user2Id = parseInt(req.params.user2Id);
    
    if (isNaN(user1Id) || isNaN(user2Id)) {
      return res.status(400).json({ message: "Invalid user ID(s)" });
    }
    
    try {
      const messages = await storage.getMessagesBetweenUsers(user1Id, user2Id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });
  
  // Get messages for a property
  app.get("/api/messages/property/:propertyId", async (req, res) => {
    const propertyId = parseInt(req.params.propertyId);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    try {
      const messages = await storage.getMessagesByProperty(propertyId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });
  
  // Send a message
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid message data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Mark message as read
  app.patch("/api/messages/:messageId/read", async (req, res) => {
    const messageId = parseInt(req.params.messageId);
    
    if (isNaN(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }
    
    try {
      const updatedMessage = await storage.markMessageAsRead(messageId);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });
  
  // User API endpoints
  
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      // Extend the schema to check for duplicate emails and usernames
      const registerSchema = insertUserSchema.extend({
        confirmPassword: z.string().min(6).max(100)
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
      });
      
      const userData = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      
      // Remove confirmPassword before creating user
      const { confirmPassword, ...userDataToSave } = userData;
      
      const user = await storage.createUser(userDataToSave);
      
      // Don't send the password back in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid registration data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // User login with /api/users/login endpoint (keep for backward compatibility)
  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't send the password back in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Authentication endpoints
  
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't send the password back in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Check authentication status
  app.get("/api/auth/check", async (req, res) => {
    // In a real app, this would check session or token
    // We just return 401 since this is a mock endpoint for our client
    res.status(401).json({ message: "Not authenticated" });
  });
  
  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });
  
  // Update user profile
  app.patch("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const userData = req.body;
      
      // Don't allow changing username or email to existing ones
      if (userData.email) {
        const existingUserByEmail = await storage.getUserByEmail(userData.email);
        if (existingUserByEmail && existingUserByEmail.id !== id) {
          return res.status(400).json({ message: "Email is already in use" });
        }
      }
      
      if (userData.username) {
        const existingUserByUsername = await storage.getUserByUsername(userData.username);
        if (existingUserByUsername && existingUserByUsername.id !== id) {
          return res.status(400).json({ message: "Username is already taken" });
        }
      }
      
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password in the response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Property creation endpoint
  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      
      // Verify that the owner exists
      const owner = await storage.getUser(propertyData.ownerId);
      if (!owner) {
        return res.status(400).json({ message: "Invalid owner ID" });
      }
      
      // Check that owner is a "Landlord & Sell" user
      if (owner.userType !== "Landlord & Sell") {
        return res.status(403).json({ message: "Only users with 'Landlord & Sell' role can create properties" });
      }
      
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid property data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ message: "Failed to create property" });
    }
  });
  
  // Update property full information
  app.patch("/api/properties/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    try {
      // Get existing property to check permissions
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check that the user updating the property is the owner
      if (existingProperty.ownerId !== req.body.ownerId) {
        return res.status(403).json({ message: "Only the property owner can update this property" });
      }
      
      // Check that owner is still a "Landlord & Sell" user
      const owner = await storage.getUser(req.body.ownerId);
      if (!owner || owner.userType !== "Landlord & Sell") {
        return res.status(403).json({ message: "Only users with 'Landlord & Sell' role can update properties" });
      }
      
      // Update property with all fields from request body
      const updatedProperty = await storage.updateProperty(id, req.body);
      
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });
  
  // Update property status endpoint
  app.patch("/api/properties/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    
    try {
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Check that status is valid
      if (!["active", "sold", "rented", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be one of: active, sold, rented, inactive" });
      }
      
      const updatedProperty = await storage.updatePropertyStatus(id, status);
      
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property status" });
    }
  });
  
  // Saved properties endpoints
  
  // Get saved properties for a user
  app.get("/api/saved-properties/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const savedProperties = await storage.getSavedPropertiesByUser(userId);
      res.json(savedProperties);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve saved properties" });
    }
  });
  
  // Save a property
  app.post("/api/saved-properties", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      
      if (!userId || !propertyId || typeof userId !== 'number' || typeof propertyId !== 'number') {
        return res.status(400).json({ message: "Both userId and propertyId are required" });
      }
      
      const savedProperty = await storage.saveProperty({ userId, propertyId });
      res.status(201).json(savedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to save property" });
    }
  });
  
  // Remove a saved property
  app.delete("/api/saved-properties", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      
      if (!userId || !propertyId || typeof userId !== 'number' || typeof propertyId !== 'number') {
        return res.status(400).json({ message: "Both userId and propertyId are required" });
      }
      
      const removed = await storage.removeSavedProperty(userId, propertyId);
      
      if (!removed) {
        return res.status(404).json({ message: "Saved property not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove saved property" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
