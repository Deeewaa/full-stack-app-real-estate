import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  agents, type Agent, type InsertAgent,
  testimonials, type Testimonial, type InsertTestimonial,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  messages, type Message, type InsertMessage,
  savedProperties, type SavedProperty, type InsertSavedProperty
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private agents: Map<number, Agent>;
  private testimonials: Map<number, Testimonial>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private messages: Map<number, Message>;
  private savedProperties: Map<number, SavedProperty>;
  
  private userId: number;
  private propertyId: number;
  private agentId: number;
  private testimonialId: number;
  private waitlistId: number;
  private messageId: number;
  private savedPropertyId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.agents = new Map();
    this.testimonials = new Map();
    this.waitlistEntries = new Map();
    this.messages = new Map();
    this.savedProperties = new Map();
    
    this.userId = 1;
    this.propertyId = 1;
    this.agentId = 1;
    this.testimonialId = 1;
    this.waitlistId = 1;
    this.messageId = 1;
    this.savedPropertyId = 1;
    
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

export const storage = new MemStorage();
