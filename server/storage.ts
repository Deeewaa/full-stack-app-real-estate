import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  agents, type Agent, type InsertAgent,
  testimonials, type Testimonial, type InsertTestimonial,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry
} from "@shared/schema";

export interface IStorage {
  // User methods (already defined, keeping them for reference)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  getPropertiesByFilters(filters: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Agent methods
  getAllAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private agents: Map<number, Agent>;
  private testimonials: Map<number, Testimonial>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  
  private userId: number;
  private propertyId: number;
  private agentId: number;
  private testimonialId: number;
  private waitlistId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.agents = new Map();
    this.testimonials = new Map();
    this.waitlistEntries = new Map();
    
    this.userId = 1;
    this.propertyId = 1;
    this.agentId = 1;
    this.testimonialId = 1;
    this.waitlistId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods - keeping original implementation
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured
    );
  }

  async getPropertiesByFilters(filters: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(property => {
      let matches = true;
      
      if (filters.location && filters.location !== "Any Location") {
        matches = matches && property.city === filters.location;
      }
      
      if (filters.propertyType && filters.propertyType !== "Any Type") {
        matches = matches && property.propertyType === filters.propertyType;
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
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
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
    const agent: Agent = { ...insertAgent, id };
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

  // Initialize with sample data
  private initializeSampleData() {
    // Sample properties
    const sampleProperties: InsertProperty[] = [
      {
        title: "Luxury Penthouse",
        description: "Spectacular penthouse with panoramic views of the city skyline",
        price: 4500000,
        location: "Manhattan, New York",
        city: "New York",
        state: "NY",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2850,
        propertyType: "Penthouse",
        isFeatured: true,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
        latitude: 40.7128,
        longitude: -74.0060
      },
      {
        title: "Modern Villa",
        description: "Stunning modern villa with minimalist design and luxurious finishes",
        price: 7250000,
        location: "Beverly Hills, Los Angeles",
        city: "Los Angeles",
        state: "CA",
        bedrooms: 6,
        bathrooms: 5,
        squareFeet: 5400,
        propertyType: "Villa",
        isFeatured: true,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: 34.0736,
        longitude: -118.4004
      },
      {
        title: "Oceanfront Estate",
        description: "Breathtaking oceanfront estate with private beach access",
        price: 8900000,
        location: "South Beach, Miami",
        city: "Miami",
        state: "FL",
        bedrooms: 5,
        bathrooms: 6,
        squareFeet: 6200,
        propertyType: "Estate",
        isFeatured: true,
        isNew: true,
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: 25.7617,
        longitude: -80.1918
      },
      {
        title: "Contemporary Mansion",
        description: "Impressive contemporary mansion with smart home technology throughout",
        price: 12500000,
        location: "Pacific Palisades, Los Angeles",
        city: "Los Angeles",
        state: "CA",
        bedrooms: 7,
        bathrooms: 8,
        squareFeet: 9800,
        propertyType: "Mansion",
        isFeatured: false,
        isNew: true,
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
        latitude: 34.0323,
        longitude: -118.5267
      },
      {
        title: "Historic Brownstone",
        description: "Beautifully restored historic brownstone with original details",
        price: 3200000,
        location: "Brooklyn Heights, New York",
        city: "New York",
        state: "NY",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 3200,
        propertyType: "House",
        isFeatured: false,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1625602812206-5ec545ca1231?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: 40.6958,
        longitude: -73.9936
      },
      {
        title: "Waterfront Retreat",
        description: "Secluded waterfront retreat with private dock and panoramic water views",
        price: 6750000,
        location: "Lake Washington, Seattle",
        city: "Seattle",
        state: "WA",
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 4800,
        propertyType: "House",
        isFeatured: false,
        isNew: false,
        imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        latitude: 47.6062,
        longitude: -122.3321
      }
    ];

    // Sample agents
    const sampleAgents: InsertAgent[] = [
      {
        name: "Jonathan Parker",
        title: "Luxury Home Specialist",
        bio: "With over 15 years of experience in high-end real estate markets across the country.",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "jonathanparker",
        linkedin: "jonathan-parker",
        email: "jonathan@estateelite.com"
      },
      {
        name: "Sophia Rodriguez",
        title: "International Properties",
        bio: "Specializing in exclusive international listings and multi-lingual negotiations.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
        instagram: "sophiarodriguez",
        linkedin: "sophia-rodriguez",
        email: "sophia@estateelite.com"
      },
      {
        name: "Michael Thompson",
        title: "Investment Advisor",
        bio: "Former financial analyst helping clients build valuable real estate portfolios.",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "michaelthompson",
        linkedin: "michael-thompson",
        email: "michael@estateelite.com"
      },
      {
        name: "Emily Chen",
        title: "Luxury Condo Expert",
        bio: "Specialized knowledge of high-rise developments in major metropolitan areas.",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "emilychen",
        linkedin: "emily-chen",
        email: "emily@estateelite.com"
      }
    ];

    // Sample testimonials
    const sampleTestimonials: InsertTestimonial[] = [
      {
        quote: "The EstateElite team provided exceptional service in helping us find our dream home. Their attention to detail and understanding of our needs made the process seamless.",
        name: "Sarah Johnson",
        location: "New York, NY",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
      },
      {
        quote: "As an international investor, I was impressed by EstateElite's global reach and expertise. They helped me secure properties in multiple countries with ease.",
        name: "David Chen",
        location: "Singapore",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      },
      {
        quote: "The exclusive access to off-market properties through EstateElite gave us a competitive edge. We found a stunning beachfront property before it was publicly listed.",
        name: "Jessica & Robert Miller",
        location: "Miami, FL",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      }
    ];

    // Add sample data to our storage
    sampleProperties.forEach(property => {
      const id = this.propertyId++;
      this.properties.set(id, { ...property, id });
    });

    sampleAgents.forEach(agent => {
      const id = this.agentId++;
      this.agents.set(id, { ...agent, id });
    });

    sampleTestimonials.forEach(testimonial => {
      const id = this.testimonialId++;
      this.testimonials.set(id, { ...testimonial, id });
    });
  }
}

export const storage = new MemStorage();
