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
    // Ensure all nullable fields have proper values
    const property: Property = { 
      ...insertProperty, 
      id,
      isFeatured: insertProperty.isFeatured ?? null,
      isNew: insertProperty.isNew ?? null,
      latitude: insertProperty.latitude ?? null,
      longitude: insertProperty.longitude ?? null
    };
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

  // Initialize with sample data
  private initializeSampleData() {
    // Sample properties
    const sampleProperties: InsertProperty[] = [
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
        longitude: 28.3228303
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
        longitude: 28.4153
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
        longitude: 25.8566
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
        longitude: 28.3370
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
        longitude: 28.2876
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
        longitude: 31.7865
      }
    ];

    // Sample agents
    const sampleAgents: InsertAgent[] = [
      {
        name: "David Wantula Makungu",
        title: "Principal Agent & Owner",
        bio: "With over 15 years of experience in Zambian real estate, specializing in luxury properties across major cities.",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        instagram: "davidmakungu",
        linkedin: "david-makungu",
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

    // Add sample data to our storage
    sampleProperties.forEach(property => {
      const id = this.propertyId++;
      this.properties.set(id, { 
        ...property, 
        id,
        isFeatured: property.isFeatured ?? null,
        isNew: property.isNew ?? null,
        latitude: property.latitude ?? null,
        longitude: property.longitude ?? null
      });
    });

    sampleAgents.forEach(agent => {
      const id = this.agentId++;
      this.agents.set(id, { 
        ...agent, 
        id,
        instagram: agent.instagram ?? null, 
        linkedin: agent.linkedin ?? null 
      });
    });

    sampleTestimonials.forEach(testimonial => {
      const id = this.testimonialId++;
      this.testimonials.set(id, { ...testimonial, id });
    });
  }
}

export const storage = new MemStorage();
