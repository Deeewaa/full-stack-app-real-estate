import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  agents, type Agent, type InsertAgent,
  testimonials, type Testimonial, type InsertTestimonial,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  messages, type Message, type InsertMessage,
  savedProperties, type SavedProperty, type InsertSavedProperty,
  neighborhoods, type Neighborhood, type InsertNeighborhood,
  amenityCategories, type AmenityCategory, type InsertAmenityCategory,
  amenities, type Amenity, type InsertAmenity,
  neighborhoodAmenities, type NeighborhoodAmenity, type InsertNeighborhoodAmenity,
  propertyNeighborhoods, type PropertyNeighborhood, type InsertPropertyNeighborhood
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  getPropertiesByFilters(filters: {
    location?: string;
    propertyType?: string;
    listingType?: string; // "rent" or "sell"
    status?: string; // "active", "sold", "rented"
    minPrice?: number;
    maxPrice?: number;
    ownerId?: number;
  }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, propertyData: Partial<InsertProperty>): Promise<Property | undefined>;
  updatePropertyStatus(id: number, status: string): Promise<Property | undefined>;
  
  // Messages methods
  getMessagesByUser(userId: number): Promise<Message[]>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getMessagesByProperty(propertyId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number): Promise<Message | undefined>;
  
  // Saved properties methods
  getSavedPropertiesByUser(userId: number): Promise<SavedProperty[]>;
  saveProperty(savedProperty: InsertSavedProperty): Promise<SavedProperty>;
  removeSavedProperty(userId: number, propertyId: number): Promise<boolean>;
  
  // Agent methods
  getAllAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  
  // Neighborhood methods
  getAllNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhood(id: number): Promise<Neighborhood | undefined>;
  getNeighborhoodsByCity(city: string): Promise<Neighborhood[]>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;
  updateNeighborhood(id: number, data: Partial<InsertNeighborhood>): Promise<Neighborhood | undefined>;
  
  // Property Neighborhood methods
  getNeighborhoodsByProperty(propertyId: number): Promise<Neighborhood[]>;
  addPropertyToNeighborhood(propertyNeighborhood: InsertPropertyNeighborhood): Promise<PropertyNeighborhood>;
  removePropertyFromNeighborhood(propertyId: number, neighborhoodId: number): Promise<boolean>;
  
  // Amenity Category methods
  getAllAmenityCategories(): Promise<AmenityCategory[]>;
  getAmenityCategory(id: number): Promise<AmenityCategory | undefined>;
  createAmenityCategory(category: InsertAmenityCategory): Promise<AmenityCategory>;
  
  // Amenity methods
  getAllAmenities(): Promise<Amenity[]>;
  getAmenity(id: number): Promise<Amenity | undefined>;
  getAmenitiesByCategory(categoryId: number): Promise<Amenity[]>;
  createAmenity(amenity: InsertAmenity): Promise<Amenity>;
  updateAmenity(id: number, data: Partial<InsertAmenity>): Promise<Amenity | undefined>;
  
  // Neighborhood Amenity methods
  getAmenitiesByNeighborhood(neighborhoodId: number): Promise<(Amenity & { distance: number })[]>;
  getNearbyAmenities(latitude: number, longitude: number, radius: number): Promise<Amenity[]>;
  addAmenityToNeighborhood(neighborhoodAmenity: InsertNeighborhoodAmenity): Promise<NeighborhoodAmenity>;
  removeAmenityFromNeighborhood(neighborhoodId: number, amenityId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private agents: Map<number, Agent>;
  private testimonials: Map<number, Testimonial>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private messages: Map<number, Message>;
  private savedProperties: Map<number, SavedProperty>;
  private neighborhoods: Map<number, Neighborhood>;
  private amenityCategories: Map<number, AmenityCategory>;
  private amenities: Map<number, Amenity>;
  private neighborhoodAmenities: Map<number, NeighborhoodAmenity>;
  private propertyNeighborhoods: Map<number, PropertyNeighborhood>;
  
  private userId: number;
  private propertyId: number;
  private agentId: number;
  private testimonialId: number;
  private waitlistId: number;
  private messageId: number;
  private savedPropertyId: number;
  private neighborhoodId: number;
  private amenityCategoryId: number;
  private amenityId: number;
  private neighborhoodAmenityId: number;
  private propertyNeighborhoodId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.agents = new Map();
    this.testimonials = new Map();
    this.waitlistEntries = new Map();
    this.messages = new Map();
    this.savedProperties = new Map();
    this.neighborhoods = new Map();
    this.amenityCategories = new Map();
    this.amenities = new Map();
    this.neighborhoodAmenities = new Map();
    this.propertyNeighborhoods = new Map();
    
    this.userId = 1;
    this.propertyId = 1;
    this.agentId = 1;
    this.testimonialId = 1;
    this.waitlistId = 1;
    this.messageId = 1;
    this.savedPropertyId = 1;
    this.neighborhoodId = 1;
    this.amenityCategoryId = 1;
    this.amenityId = 1;
    this.neighborhoodAmenityId = 1;
    this.propertyNeighborhoodId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      phoneNumber: insertUser.phoneNumber ?? null,
      bio: insertUser.bio ?? null,
      profileImage: insertUser.profileImage ?? null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...userData,
      // Ensure these fields remain non-null if they were updated to null/undefined
      phoneNumber: userData.phoneNumber ?? user.phoneNumber,
      bio: userData.bio ?? user.bio,
      profileImage: userData.profileImage ?? user.profileImage
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.ownerId === ownerId
    );
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured && property.status === "active"
    );
  }

  async getPropertiesByFilters(filters: {
    location?: string;
    propertyType?: string;
    listingType?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    ownerId?: number;
  }): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => {
      let matches = true;
      
      if (filters.location && filters.location !== "Any Location") {
        matches = matches && property.city === filters.location;
      }
      
      if (filters.propertyType && filters.propertyType !== "Any Type") {
        matches = matches && property.propertyType === filters.propertyType;
      }
      
      if (filters.listingType && filters.listingType !== "Any") {
        matches = matches && property.listingType === filters.listingType;
      }
      
      if (filters.status) {
        matches = matches && property.status === filters.status;
      }
      
      if (filters.ownerId) {
        matches = matches && property.ownerId === filters.ownerId;
      }
      
      if (filters.minPrice) {
        matches = matches && property.price >= filters.minPrice;
      }
      
      if (filters.maxPrice) {
        matches = matches && property.price <= filters.maxPrice;
      }
      
      return matches;
    });
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const now = new Date();
    
    // Ensure all nullable fields have proper values
    const property: Property = { 
      ...insertProperty, 
      id,
      status: insertProperty.status ?? "active",
      createdAt: now,
      updatedAt: now,
      isFeatured: insertProperty.isFeatured ?? false,
      isNew: insertProperty.isNew ?? false,
      additionalImages: insertProperty.additionalImages ?? [],
      latitude: insertProperty.latitude ?? null,
      longitude: insertProperty.longitude ?? null
    };
    
    this.properties.set(id, property);
    return property;
  }
  
  async updateProperty(id: number, propertyData: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty: Property = {
      ...property,
      ...propertyData,
      // Ensure these fields remain non-null if they were updated to null/undefined
      additionalImages: propertyData.additionalImages ?? property.additionalImages,
      latitude: propertyData.latitude ?? property.latitude,
      longitude: propertyData.longitude ?? property.longitude,
      status: propertyData.status ?? property.status,
      isFeatured: propertyData.isFeatured ?? property.isFeatured,
      isNew: propertyData.isNew ?? property.isNew,
      updatedAt: new Date()
    };
    
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  async updatePropertyStatus(id: number, status: string): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty: Property = {
      ...property,
      status,
      updatedAt: new Date()
    };
    
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  // Agent methods
  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.agentId++;
    // Ensure all nullable fields have proper values
    const agent: Agent = { 
      ...insertAgent, 
      id,
      instagram: insertAgent.instagram ?? null, 
      linkedin: insertAgent.linkedin ?? null 
    };
    this.agents.set(id, agent);
    return agent;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Waitlist methods
  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.waitlistId++;
    const entry: WaitlistEntry = { ...insertEntry, id };
    this.waitlistEntries.set(id, entry);
    return entry;
  }
  
  // Messages methods
  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.recipientId === userId
    );
  }
  
  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === user1Id && message.recipientId === user2Id) ||
        (message.senderId === user2Id && message.recipientId === user1Id)
    );
  }
  
  async getMessagesByProperty(propertyId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.propertyId === propertyId
    );
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    const newMessage: Message = { 
      ...message, 
      id,
      createdAt: now,
      propertyId: message.propertyId ?? null,
      isRead: message.isRead ?? false 
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  
  async markMessageAsRead(messageId: number): Promise<Message | undefined> {
    const message = this.messages.get(messageId);
    if (!message) return undefined;
    
    const updatedMessage: Message = {
      ...message,
      isRead: true
    };
    
    this.messages.set(messageId, updatedMessage);
    return updatedMessage;
  }
  
  // Saved properties methods
  async getSavedPropertiesByUser(userId: number): Promise<SavedProperty[]> {
    return Array.from(this.savedProperties.values()).filter(
      (savedProperty) => savedProperty.userId === userId
    );
  }
  
  async saveProperty(savedProperty: InsertSavedProperty): Promise<SavedProperty> {
    const id = this.savedPropertyId++;
    const now = new Date();
    const newSavedProperty: SavedProperty = { 
      ...savedProperty, 
      id,
      createdAt: now
    };
    this.savedProperties.set(id, newSavedProperty);
    return newSavedProperty;
  }
  
  async removeSavedProperty(userId: number, propertyId: number): Promise<boolean> {
    const savedPropertyEntry = Array.from(this.savedProperties.entries()).find(
      ([_, savedProperty]) => savedProperty.userId === userId && savedProperty.propertyId === propertyId
    );
    
    if (!savedPropertyEntry) return false;
    
    const [id, _] = savedPropertyEntry;
    return this.savedProperties.delete(id);
  }
  
  // Neighborhood methods
  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    return Array.from(this.neighborhoods.values());
  }

  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    return this.neighborhoods.get(id);
  }

  async getNeighborhoodsByCity(city: string): Promise<Neighborhood[]> {
    return Array.from(this.neighborhoods.values()).filter(
      (neighborhood) => neighborhood.city === city
    );
  }

  async createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const id = this.neighborhoodId++;
    const newNeighborhood: Neighborhood = { 
      ...neighborhood, 
      id 
    };
    this.neighborhoods.set(id, newNeighborhood);
    return newNeighborhood;
  }

  async updateNeighborhood(id: number, data: Partial<InsertNeighborhood>): Promise<Neighborhood | undefined> {
    const neighborhood = this.neighborhoods.get(id);
    if (!neighborhood) return undefined;
    
    const updatedNeighborhood: Neighborhood = {
      ...neighborhood,
      ...data
    };
    
    this.neighborhoods.set(id, updatedNeighborhood);
    return updatedNeighborhood;
  }
  
  // Property Neighborhood methods
  async getNeighborhoodsByProperty(propertyId: number): Promise<Neighborhood[]> {
    const propertyNeighborhoodRelations = Array.from(this.propertyNeighborhoods.values())
      .filter(relation => relation.propertyId === propertyId);
    
    return propertyNeighborhoodRelations.map(relation => 
      this.neighborhoods.get(relation.neighborhoodId)
    ).filter((neighborhood): neighborhood is Neighborhood => neighborhood !== undefined);
  }

  async addPropertyToNeighborhood(propertyNeighborhood: InsertPropertyNeighborhood): Promise<PropertyNeighborhood> {
    const id = this.propertyNeighborhoodId++;
    const newRelation: PropertyNeighborhood = { 
      ...propertyNeighborhood, 
      id 
    };
    this.propertyNeighborhoods.set(id, newRelation);
    return newRelation;
  }

  async removePropertyFromNeighborhood(propertyId: number, neighborhoodId: number): Promise<boolean> {
    const relation = Array.from(this.propertyNeighborhoods.entries()).find(
      ([_, relation]) => relation.propertyId === propertyId && relation.neighborhoodId === neighborhoodId
    );
    
    if (!relation) return false;
    
    const [id, _] = relation;
    return this.propertyNeighborhoods.delete(id);
  }
  
  // Amenity Category methods
  async getAllAmenityCategories(): Promise<AmenityCategory[]> {
    return Array.from(this.amenityCategories.values());
  }

  async getAmenityCategory(id: number): Promise<AmenityCategory | undefined> {
    return this.amenityCategories.get(id);
  }

  async createAmenityCategory(category: InsertAmenityCategory): Promise<AmenityCategory> {
    const id = this.amenityCategoryId++;
    const newCategory: AmenityCategory = { 
      ...category, 
      id 
    };
    this.amenityCategories.set(id, newCategory);
    return newCategory;
  }
  
  // Amenity methods
  async getAllAmenities(): Promise<Amenity[]> {
    return Array.from(this.amenities.values());
  }

  async getAmenity(id: number): Promise<Amenity | undefined> {
    return this.amenities.get(id);
  }

  async getAmenitiesByCategory(categoryId: number): Promise<Amenity[]> {
    return Array.from(this.amenities.values()).filter(
      (amenity) => amenity.categoryId === categoryId
    );
  }

  async createAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const id = this.amenityId++;
    const newAmenity: Amenity = { 
      ...amenity, 
      id,
      description: amenity.description ?? null,
      imageUrl: amenity.imageUrl ?? null,
      phoneNumber: amenity.phoneNumber ?? null,
      website: amenity.website ?? null
    };
    this.amenities.set(id, newAmenity);
    return newAmenity;
  }

  async updateAmenity(id: number, data: Partial<InsertAmenity>): Promise<Amenity | undefined> {
    const amenity = this.amenities.get(id);
    if (!amenity) return undefined;
    
    const updatedAmenity: Amenity = {
      ...amenity,
      ...data
    };
    
    this.amenities.set(id, updatedAmenity);
    return updatedAmenity;
  }
  
  // Neighborhood Amenity methods
  async getAmenitiesByNeighborhood(neighborhoodId: number): Promise<(Amenity & { distance: number })[]> {
    const relations = Array.from(this.neighborhoodAmenities.values())
      .filter(relation => relation.neighborhoodId === neighborhoodId);
    
    return relations.map(relation => {
      const amenity = this.amenities.get(relation.amenityId);
      if (!amenity) return null;
      
      return {
        ...amenity,
        distance: relation.distance ?? 0
      };
    }).filter((amenity): amenity is (Amenity & { distance: number }) => amenity !== null);
  }

  async getNearbyAmenities(latitude: number, longitude: number, radius: number): Promise<Amenity[]> {
    // This is a simplified implementation that doesn't actually calculate distances
    // In a real application, you would calculate distance based on coordinates
    return Array.from(this.amenities.values()).filter(amenity => {
      if (!amenity.latitude || !amenity.longitude) return false;
      
      // Simple distance calculation using Euclidean distance (not accurate for real-world distances)
      // A proper implementation would use the Haversine formula
      const distance = Math.sqrt(
        Math.pow(amenity.latitude - latitude, 2) + 
        Math.pow(amenity.longitude - longitude, 2)
      );
      
      // Convert to approximate kilometers (rough approximation)
      // 0.01 degrees is approximately 1.11 km at the equator
      const distanceInKm = distance * 111;
      
      return distanceInKm <= radius;
    });
  }

  async addAmenityToNeighborhood(neighborhoodAmenity: InsertNeighborhoodAmenity): Promise<NeighborhoodAmenity> {
    const id = this.neighborhoodAmenityId++;
    const newRelation: NeighborhoodAmenity = { 
      ...neighborhoodAmenity, 
      id,
      distance: neighborhoodAmenity.distance ?? 0
    };
    this.neighborhoodAmenities.set(id, newRelation);
    return newRelation;
  }

  async removeAmenityFromNeighborhood(neighborhoodId: number, amenityId: number): Promise<boolean> {
    const relation = Array.from(this.neighborhoodAmenities.entries()).find(
      ([_, relation]) => relation.neighborhoodId === neighborhoodId && relation.amenityId === amenityId
    );
    
    if (!relation) return false;
    
    const [id, _] = relation;
    return this.neighborhoodAmenities.delete(id);
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Create admin user for property ownership
    const adminId = this.userId++;
    const adminUser: User = {
      id: adminId,
      username: "admin",
      password: "admin123",
      email: "admin@realtyestate.com",
      fullName: "David Wantula Emert Makungu",
      userType: "Landlord & Sell",
      phoneNumber: "+260964391774",
      bio: "With over 15 years of experience in Zambian real estate.",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      createdAt: new Date()
    };
    this.users.set(adminId, adminUser);
    
    // Create sample properties
    const propertyData = [
      {
        title: "Luxury Penthouse",
        description: "Spectacular penthouse with panoramic views of the Lusaka skyline",
        price: 18500000, // 18.5 million ZMW
        location: "Kabulonga, Lusaka",
        city: "Lusaka",
        state: "Lusaka Province",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2850,
        propertyType: "Penthouse",
        isFeatured: true,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
        latitude: -15.3875259,
        longitude: 28.3228303,
        listingType: "sell"
      },
      {
        title: "Modern Villa",
        description: "Stunning modern villa with minimalist design and luxurious finishes",
        price: 25000000, // 25 million ZMW
        location: "Ibex Hill, Lusaka",
        city: "Lusaka",
        state: "Lusaka Province",
        bedrooms: 6,
        bathrooms: 5,
        squareFeet: 5400,
        propertyType: "Villa",
        isFeatured: true,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: -15.3521,
        longitude: 28.4153,
        listingType: "sell"
      },
      {
        title: "Zambezi Riverfront Estate",
        description: "Breathtaking riverfront estate with private access to the Zambezi River",
        price: 35000000, // 35 million ZMW
        location: "Livingstone",
        city: "Livingstone",
        state: "Southern Province",
        bedrooms: 5,
        bathrooms: 6,
        squareFeet: 6200,
        propertyType: "Estate",
        isFeatured: true,
        isNew: true,
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: -17.8516,
        longitude: 25.8566,
        listingType: "sell"
      },
      {
        title: "Contemporary Mansion",
        description: "Impressive contemporary mansion with smart home technology throughout",
        price: 42000000, // 42 million ZMW
        location: "Leopards Hill, Lusaka",
        city: "Lusaka",
        state: "Lusaka Province",
        bedrooms: 7,
        bathrooms: 8,
        squareFeet: 9800,
        propertyType: "Mansion",
        isFeatured: false,
        isNew: true,
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
        latitude: -15.4112,
        longitude: 28.3370,
        listingType: "sell"
      },
      {
        title: "Luxury City Apartment",
        description: "Beautifully designed luxury apartment in the heart of Lusaka's business district",
        price: 9800000, // 9.8 million ZMW
        location: "Cairo Road, Lusaka",
        city: "Lusaka",
        state: "Lusaka Province",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        propertyType: "Apartment",
        isFeatured: false,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1625602812206-5ec545ca1231?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: -15.4174,
        longitude: 28.2876,
        listingType: "rent"
      },
      {
        title: "Safari Lodge Investment",
        description: "Commercial safari lodge with stunning views of the wildlife and natural landscape",
        price: 28500000, // 28.5 million ZMW
        location: "South Luangwa National Park",
        city: "Mfuwe",
        state: "Eastern Province",
        bedrooms: 12,
        bathrooms: 14,
        squareFeet: 8500,
        propertyType: "Commercial",
        isFeatured: false,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: -13.1467,
        longitude: 31.7865,
        listingType: "sell"
      }
    ];

    // Create properties
    for (const prop of propertyData) {
      const id = this.propertyId++;
      const now = new Date();
      
      const property: Property = {
        id,
        ownerId: adminId,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        location: prop.location,
        city: prop.city,
        state: prop.state,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        squareFeet: prop.squareFeet,
        propertyType: prop.propertyType,
        listingType: prop.listingType,
        status: "active",
        createdAt: now,
        updatedAt: now,
        isFeatured: prop.isFeatured ?? false,
        isNew: prop.isNew ?? false,
        imageUrl: prop.imageUrl,
        additionalImages: [],
        latitude: prop.latitude ?? null,
        longitude: prop.longitude ?? null
      };
      
      this.properties.set(id, property);
    }

    // Sample agents
    const sampleAgents: InsertAgent[] = [
      {
        name: "David Wantula Emert Makungu",
        title: "Principal Agent & Owner",
        bio: "With over 15 years of experience in Zambian real estate, specializing in luxury properties across major cities.",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "david_wantula_emert_makungu",
        linkedin: "david-wantula-emert-makungu",
        email: "david@realtyestate.com"
      },
      {
        name: "Natasha Mwansa",
        title: "International Properties",
        bio: "Specializing in connecting international investors with premium Zambian real estate opportunities.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
        instagram: "natashamwansa",
        linkedin: "natasha-mwansa",
        email: "natasha@realtyestate.com"
      },
      {
        name: "Mulenga Chipimo",
        title: "Investment Advisor",
        bio: "Former Bank of Zambia financial analyst helping clients build valuable real estate portfolios across Zambia.",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "mulengachipimo",
        linkedin: "mulenga-chipimo",
        email: "mulenga@realtyestate.com"
      },
      {
        name: "Chilufya Banda",
        title: "Commercial Property Expert",
        bio: "Specialized knowledge of commercial developments in Lusaka and the Copperbelt regions.",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "chilufyabanda",
        linkedin: "chilufya-banda",
        email: "chilufya@realtyestate.com"
      }
    ];

    // Create agents
    sampleAgents.forEach(agent => {
      const id = this.agentId++;
      this.agents.set(id, { 
        ...agent, 
        id,
        instagram: agent.instagram ?? null, 
        linkedin: agent.linkedin ?? null 
      });
    });

    // Initialize neighborhoods
    const sampleNeighborhoods: InsertNeighborhood[] = [
      {
        name: "Kabulonga",
        city: "Lusaka",
        description: "An upscale residential area with spacious homes, good schools, and diplomatic missions. Known for its quiet streets, international restaurants, and proximity to shopping centers.",
        safetyRating: 9,
        walkabilityScore: 6,
        schoolRating: 8,
        imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        latitude: -15.3911,
        longitude: 28.2856
      },
      {
        name: "Woodlands",
        city: "Lusaka",
        description: "A well-established residential area with a mix of older homes and new developments. Convenient access to Lusaka's central business district, with several local businesses and restaurants.",
        safetyRating: 7,
        walkabilityScore: 8,
        schoolRating: 7,
        imageUrl: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        latitude: -15.4044,
        longitude: 28.3196
      },
      {
        name: "Ibex Hill",
        city: "Lusaka",
        description: "An exclusive suburb southeast of Lusaka with large properties and luxury homes. Features peaceful surroundings, wildlife sightings, and a secluded atmosphere while still being close to the city.",
        safetyRating: 9,
        walkabilityScore: 4,
        schoolRating: 8,
        imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: -15.4208,
        longitude: 28.3933
      },
      {
        name: "Roma Park",
        city: "Lusaka",
        description: "A modern mixed-use development with upscale homes, apartments, and a commercial center. Features planned infrastructure, a shopping mall, and recreational facilities.",
        safetyRating: 8,
        walkabilityScore: 9,
        schoolRating: 8,
        imageUrl: "https://images.unsplash.com/photo-1605146768851-eda79da33899?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        latitude: -15.3749,
        longitude: 28.2976
      },
      {
        name: "Livingstone Central",
        city: "Livingstone",
        description: "The heart of Livingstone city, offering a mix of colonial architecture, modern amenities, and proximity to Victoria Falls. Known for its vibrant atmosphere, tourist attractions, and cultural heritage.",
        safetyRating: 7,
        walkabilityScore: 9,
        schoolRating: 7,
        imageUrl: "https://images.unsplash.com/photo-1516498188851-408dbf70b610?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        latitude: -17.8516,
        longitude: 25.8615
      }
    ];
    
    // Create neighborhoods
    sampleNeighborhoods.forEach(neighborhood => {
      const id = this.neighborhoodId++;
      this.neighborhoods.set(id, { ...neighborhood, id });
    });
    
    // Initialize amenity categories
    const sampleAmenityCategories: InsertAmenityCategory[] = [
      { name: "Education", icon: "school" },
      { name: "Healthcare", icon: "stethoscope" },
      { name: "Shopping", icon: "shopping-bag" },
      { name: "Dining", icon: "utensils" },
      { name: "Recreation", icon: "tree" },
      { name: "Transportation", icon: "bus" },
      { name: "Financial", icon: "credit-card" }
    ];
    
    // Create amenity categories
    const categoryMap = new Map<string, number>();
    sampleAmenityCategories.forEach(category => {
      const id = this.amenityCategoryId++;
      this.amenityCategories.set(id, { ...category, id });
      categoryMap.set(category.name, id);
    });
    
    // Initialize amenities
    const sampleAmenities: (InsertAmenity & { categoryName: string })[] = [
      {
        name: "International School of Lusaka",
        categoryName: "Education",
        address: "Plot 1320, Kasangula Road, Lusaka",
        description: "Elite international school offering IB curriculum from primary to high school.",
        imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        website: "https://www.islschool.org",
        phoneNumber: "+260 211 260715",
        latitude: -15.3980,
        longitude: 28.3136
      },
      {
        name: "Lusaka Heart Hospital",
        categoryName: "Healthcare",
        address: "Plot 178, Great East Road, Lusaka",
        description: "Specialized cardiac care center with modern facilities and experienced specialists.",
        imageUrl: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        website: "https://www.lusakahearthospital.co.zm",
        phoneNumber: "+260 211 754321",
        latitude: -15.4103,
        longitude: 28.3262
      },
      {
        name: "East Park Mall",
        categoryName: "Shopping",
        address: "Plot 17398, Thabo Mbeki Road, Lusaka",
        description: "Modern shopping center with local and international retail stores, restaurants, and entertainment options.",
        imageUrl: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        website: "https://www.eastparkmall.co.zm",
        phoneNumber: "+260 211 123456",
        latitude: -15.4115,
        longitude: 28.3409
      },
      {
        name: "Latitude 15",
        categoryName: "Dining",
        address: "Plot 810, Great East Road, Lusaka",
        description: "Upscale boutique hotel with excellent restaurant serving international and local cuisine.",
        imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        website: "https://www.latitude15.com",
        phoneNumber: "+260 211 268802",
        latitude: -15.3929,
        longitude: 28.3497
      },
      {
        name: "Lusaka Golf Club",
        categoryName: "Recreation",
        address: "Plot 7143, Leopards Hill Road, Lusaka",
        description: "Historic 18-hole golf course with clubhouse facilities and restaurant.",
        imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        website: "https://www.lusakagolfclub.com",
        phoneNumber: "+260 211 278410",
        latitude: -15.3996,
        longitude: 28.3245
      },
      {
        name: "Kenneth Kaunda International Airport",
        categoryName: "Transportation",
        address: "Great East Road, Lusaka",
        description: "Lusaka's main international airport with domestic and international flight connections.",
        imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        website: "https://www.zacl.co.zm",
        phoneNumber: "+260 211 271298",
        latitude: -15.3307,
        longitude: 28.4326
      },
      {
        name: "Zanaco Bank - Manda Hill Branch",
        categoryName: "Financial",
        address: "Manda Hill Mall, Great East Road, Lusaka",
        description: "Full-service banking center offering personal and business banking services.",
        imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        website: "https://www.zanaco.co.zm",
        phoneNumber: "+260 211 254967",
        latitude: -15.3985,
        longitude: 28.3312
      },
      {
        name: "Royal Livingstone Hotel",
        categoryName: "Recreation",
        address: "Mosi-oa-Tunya Road, Livingstone",
        description: "Luxury 5-star hotel on the banks of the Zambezi River with views of Victoria Falls.",
        imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
        website: "https://www.anantara.com/en/royal-livingstone",
        phoneNumber: "+260 213 321122",
        latitude: -17.8555,
        longitude: 25.8573
      }
    ];
    
    // Create amenities
    sampleAmenities.forEach(amenityData => {
      const id = this.amenityId++;
      const categoryId = categoryMap.get(amenityData.categoryName) || 1;
      const { categoryName, ...amenity } = amenityData;
      
      this.amenities.set(id, { 
        id,
        name: amenity.name,
        description: amenity.description || "",
        imageUrl: amenity.imageUrl || "",
        phoneNumber: amenity.phoneNumber || "",
        website: amenity.website || "",
        latitude: amenity.latitude,
        longitude: amenity.longitude,
        address: amenity.address,
        categoryId
      });
    });
    
    // Connect neighborhoods with amenities
    // Kabulonga neighborhood (id: 1) with nearby amenities
    this.addAmenityToNeighborhood({ neighborhoodId: 1, amenityId: 1, distance: 1.2 });
    this.addAmenityToNeighborhood({ neighborhoodId: 1, amenityId: 5, distance: 1.5 });
    
    // Woodlands neighborhood (id: 2) with nearby amenities
    this.addAmenityToNeighborhood({ neighborhoodId: 2, amenityId: 2, distance: 0.8 });
    this.addAmenityToNeighborhood({ neighborhoodId: 2, amenityId: 7, distance: 1.0 });
    
    // Ibex Hill neighborhood (id: A3) with nearby amenities
    this.addAmenityToNeighborhood({ neighborhoodId: 3, amenityId: 4, distance: 2.1 });
    this.addAmenityToNeighborhood({ neighborhoodId: 3, amenityId: 6, distance: 4.5 });
    
    // Roma Park neighborhood (id: 4) with nearby amenities
    this.addAmenityToNeighborhood({ neighborhoodId: 4, amenityId: 3, distance: 0.3 });
    
    // Livingstone Central neighborhood (id: 5) with nearby amenities
    this.addAmenityToNeighborhood({ neighborhoodId: 5, amenityId: 8, distance: 1.8 });
    
    // Connect properties with neighborhoods
    // Luxury Penthouse (id: 1) in Kabulonga (id: 1)
    this.addPropertyToNeighborhood({ propertyId: 1, neighborhoodId: 1 });
    
    // Modern Villa (id: 2) in Ibex Hill (id: 3)
    this.addPropertyToNeighborhood({ propertyId: 2, neighborhoodId: 3 });
    
    // Zambezi Riverfront Estate (id: 3) in Livingstone (id: 5)
    this.addPropertyToNeighborhood({ propertyId: 3, neighborhoodId: 5 });
    
    // Contemporary Mansion (id: 4) in Kabulonga (id: 1)
    this.addPropertyToNeighborhood({ propertyId: 4, neighborhoodId: 1 });
    
    // Luxury City Apartment (id: 5) in Woodlands (id: 2)
    this.addPropertyToNeighborhood({ propertyId: 5, neighborhoodId: 2 });
    
    // Sample testimonials
    const sampleTestimonials: InsertTestimonial[] = [
      {
        quote: "Realty Estate provided exceptional service in helping us find our dream home in Lusaka. David's personal attention to detail and understanding of our needs made the process seamless.",
        name: "Mutale Kapaso",
        location: "Lusaka, Zambia",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
      },
      {
        quote: "As an international investor, I was impressed by Realty Estate's expertise in the Zambian market. They helped me secure premium properties in Lusaka that have already appreciated in value.",
        name: "James Phiri",
        location: "London, UK (Zambian expatriate)",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      },
      {
        quote: "The exclusive access to off-market properties through Realty Estate gave us a competitive edge. We found a stunning Zambezi riverfront property before it was publicly listed.",
        name: "Bwalya & Namwinga Tembo",
        location: "Livingstone, Zambia",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      }
    ];

    // Create testimonials
    sampleTestimonials.forEach(testimonial => {
      const id = this.testimonialId++;
      this.testimonials.set(id, { ...testimonial, id });
    });
    
    // Add some sample users
    const sampleUsers = [
      {
        username: "buyer1",
        password: "password123",
        email: "buyer1@example.com",
        fullName: "Chishimba Mulenga",
        userType: "Rent & Buy",
        phoneNumber: "+260977123456",
        bio: "Looking for a family home in Lusaka",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      },
      {
        username: "seller1",
        password: "password123",
        email: "seller1@example.com",
        fullName: "Nkandu Phiri",
        userType: "Landlord & Sell",
        phoneNumber: "+260966789012",
        bio: "Property investor with multiple listings",
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      }
    ];
    
    // Create sample users
    const createdUserIds: number[] = [];
    sampleUsers.forEach(user => {
      const id = this.userId++;
      createdUserIds.push(id);
      this.users.set(id, { 
        ...user, 
        id,
        phoneNumber: user.phoneNumber ?? null,
        bio: user.bio ?? null,
        profileImage: user.profileImage ?? null,
        createdAt: new Date()
      });
    });
    
    // Get the first property ID from our properties map
    const firstPropertyId = Array.from(this.properties.keys())[0] || null;
    
    // Add sample messages between users
    const sampleMessages = [
      {
        senderId: adminId,
        recipientId: createdUserIds[0],
        content: "Hello! I saw you're interested in properties in Lusaka. I have several listings that might interest you.",
        propertyId: firstPropertyId,
        isRead: true
      },
      {
        senderId: createdUserIds[0],
        recipientId: adminId,
        content: "Yes, I'm looking for a 3-bedroom house in Kabulonga or Ibex Hill. What do you have available?",
        propertyId: firstPropertyId,
        isRead: true
      },
      {
        senderId: adminId,
        recipientId: createdUserIds[0],
        content: "I have a beautiful penthouse in Kabulonga that just came on the market. Would you like to schedule a viewing?",
        propertyId: firstPropertyId,
        isRead: false
      },
      {
        senderId: createdUserIds[1],
        recipientId: adminId,
        content: "I'm interested in listing my property with your agency. What are your commission rates?",
        propertyId: null,
        isRead: false
      }
    ];
    
    // Create sample messages
    sampleMessages.forEach(message => {
      const id = this.messageId++;
      this.messages.set(id, {
        ...message,
        id,
        createdAt: new Date()
      });
    });
    
    // Get property IDs for saved properties
    const propertyIds = Array.from(this.properties.keys());
    
    // Add sample saved properties (if we have at least 2 properties)
    const sampleSavedProperties = propertyIds.length >= 2 ? [
      {
        userId: createdUserIds[0],
        propertyId: propertyIds[0]
      },
      {
        userId: createdUserIds[0],
        propertyId: propertyIds.length > 1 ? propertyIds[1] : propertyIds[0]
      }
    ] : [];
    
    // Create sample saved properties
    sampleSavedProperties.forEach(savedProperty => {
      const id = this.savedPropertyId++;
      this.savedProperties.set(id, {
        ...savedProperty,
        id,
        createdAt: new Date()
      });
    });
  }
}

// Import the DbStorage implementation
import { DbStorage } from './db-storage';

// Use database storage instead of memory storage
export const storage = new DbStorage();
