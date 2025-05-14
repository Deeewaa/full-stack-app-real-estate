import { and, eq, like, or, gte, lte, sql, asc, desc } from 'drizzle-orm';
import { db } from './db';
import { IStorage } from './storage';
import {
  User, InsertUser, users,
  Property, InsertProperty, properties,
  Agent, InsertAgent, agents,
  Testimonial, InsertTestimonial, testimonials,
  WaitlistEntry, InsertWaitlistEntry, waitlistEntries,
  Message, InsertMessage, messages,
  SavedProperty, InsertSavedProperty, savedProperties,
  Neighborhood, InsertNeighborhood, neighborhoods,
  AmenityCategory, InsertAmenityCategory, amenityCategories,
  Amenity, InsertAmenity, amenities,
  NeighborhoodAmenity, InsertNeighborhoodAmenity, neighborhoodAmenities,
  PropertyNeighborhood, InsertPropertyNeighborhood, propertyNeighborhoods
} from '../../shared/schema';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await db.insert(users).values(user).returning();
    return results[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const results = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return results[0];
  }
  
  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const results = await db.select().from(properties).where(eq(properties.id, id));
    return results[0];
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.ownerId, ownerId));
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.isFeatured, true));
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
    let conditions = [];
    
    if (filters.location) {
      conditions.push(
        or(
          like(properties.location, `%${filters.location}%`),
          like(properties.city, `%${filters.location}%`),
          like(properties.state, `%${filters.location}%`),
        )
      );
    }
    
    if (filters.propertyType) {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    
    if (filters.listingType) {
      conditions.push(eq(properties.listingType, filters.listingType));
    }
    
    if (filters.status) {
      conditions.push(eq(properties.status, filters.status));
    }
    
    if (filters.minPrice !== undefined) {
      conditions.push(gte(properties.price, filters.minPrice));
    }
    
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }
    
    if (filters.ownerId !== undefined) {
      conditions.push(eq(properties.ownerId, filters.ownerId));
    }
    
    if (conditions.length === 0) {
      return await db.select().from(properties);
    }
    
    const whereClause = conditions.reduce((acc, condition) => {
      return acc ? and(acc, condition) : condition;
    });
    
    return await db.select().from(properties).where(whereClause);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const results = await db.insert(properties).values(property).returning();
    return results[0];
  }

  async updateProperty(id: number, propertyData: Partial<InsertProperty>): Promise<Property | undefined> {
    const results = await db.update(properties)
      .set(propertyData)
      .where(eq(properties.id, id))
      .returning();
    return results[0];
  }

  async updatePropertyStatus(id: number, status: string): Promise<Property | undefined> {
    const results = await db.update(properties)
      .set({ status })
      .where(eq(properties.id, id))
      .returning();
    return results[0];
  }
  
  // Agent methods
  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const results = await db.select().from(agents).where(eq(agents.id, id));
    return results[0];
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const results = await db.insert(agents).values(agent).returning();
    return results[0];
  }
  
  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const results = await db.insert(testimonials).values(testimonial).returning();
    return results[0];
  }
  
  // Waitlist methods
  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const results = await db.insert(waitlistEntries).values(entry).returning();
    return results[0];
  }
  
  // Messages methods
  async getMessagesByUser(userId: number): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.recipientId, userId)
      )
    );
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(
        and(
          eq(messages.senderId, user1Id),
          eq(messages.recipientId, user2Id)
        ),
        and(
          eq(messages.senderId, user2Id),
          eq(messages.recipientId, user1Id)
        )
      )
    );
  }

  async getMessagesByProperty(propertyId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.propertyId, propertyId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const results = await db.insert(messages).values(message).returning();
    return results[0];
  }

  async markMessageAsRead(messageId: number): Promise<Message | undefined> {
    const results = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId))
      .returning();
    return results[0];
  }
  
  // Saved properties methods
  async getSavedPropertiesByUser(userId: number): Promise<SavedProperty[]> {
    return await db.select().from(savedProperties).where(eq(savedProperties.userId, userId));
  }

  async saveProperty(savedProperty: InsertSavedProperty): Promise<SavedProperty> {
    const results = await db.insert(savedProperties).values(savedProperty).returning();
    return results[0];
  }

  async removeSavedProperty(userId: number, propertyId: number): Promise<boolean> {
    const results = await db.delete(savedProperties)
      .where(
        and(
          eq(savedProperties.userId, userId),
          eq(savedProperties.propertyId, propertyId)
        )
      );
    // Just check if the operation was executed successfully
    return true;
  }
  
  // Neighborhood methods
  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    return await db.select().from(neighborhoods);
  }

  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    const results = await db.select().from(neighborhoods).where(eq(neighborhoods.id, id));
    return results[0];
  }

  async getNeighborhoodsByCity(city: string): Promise<Neighborhood[]> {
    return await db.select().from(neighborhoods).where(like(neighborhoods.city, `%${city}%`));
  }

  async createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const results = await db.insert(neighborhoods).values(neighborhood).returning();
    return results[0];
  }

  async updateNeighborhood(id: number, data: Partial<InsertNeighborhood>): Promise<Neighborhood | undefined> {
    const results = await db.update(neighborhoods)
      .set(data)
      .where(eq(neighborhoods.id, id))
      .returning();
    return results[0];
  }
  
  // Property Neighborhood methods
  async getNeighborhoodsByProperty(propertyId: number): Promise<Neighborhood[]> {
    const propertyNeighborhoodRecords = await db.select()
      .from(propertyNeighborhoods)
      .where(eq(propertyNeighborhoods.propertyId, propertyId));
    
    if (propertyNeighborhoodRecords.length === 0) {
      return [];
    }
    
    const neighborhoodIds = propertyNeighborhoodRecords.map(record => record.neighborhoodId);
    
    return await db.select()
      .from(neighborhoods)
      .where(sql`${neighborhoods.id} IN (${neighborhoodIds.join(',')})`);
  }

  async addPropertyToNeighborhood(propertyNeighborhood: InsertPropertyNeighborhood): Promise<PropertyNeighborhood> {
    const results = await db.insert(propertyNeighborhoods)
      .values(propertyNeighborhood)
      .returning();
    return results[0];
  }

  async removePropertyFromNeighborhood(propertyId: number, neighborhoodId: number): Promise<boolean> {
    const results = await db.delete(propertyNeighborhoods)
      .where(
        and(
          eq(propertyNeighborhoods.propertyId, propertyId),
          eq(propertyNeighborhoods.neighborhoodId, neighborhoodId)
        )
      );
    // Just check if the operation was executed successfully
    return true;
  }
  
  // Amenity Category methods
  async getAllAmenityCategories(): Promise<AmenityCategory[]> {
    return await db.select().from(amenityCategories);
  }

  async getAmenityCategory(id: number): Promise<AmenityCategory | undefined> {
    const results = await db.select().from(amenityCategories).where(eq(amenityCategories.id, id));
    return results[0];
  }

  async createAmenityCategory(category: InsertAmenityCategory): Promise<AmenityCategory> {
    const results = await db.insert(amenityCategories).values(category).returning();
    return results[0];
  }
  
  // Amenity methods
  async getAllAmenities(): Promise<Amenity[]> {
    return await db.select().from(amenities);
  }

  async getAmenity(id: number): Promise<Amenity | undefined> {
    const results = await db.select().from(amenities).where(eq(amenities.id, id));
    return results[0];
  }

  async getAmenitiesByCategory(categoryId: number): Promise<Amenity[]> {
    return await db.select().from(amenities).where(eq(amenities.categoryId, categoryId));
  }

  async createAmenity(amenity: InsertAmenity): Promise<Amenity> {
    const results = await db.insert(amenities).values(amenity).returning();
    return results[0];
  }

  async updateAmenity(id: number, data: Partial<InsertAmenity>): Promise<Amenity | undefined> {
    const results = await db.update(amenities)
      .set(data)
      .where(eq(amenities.id, id))
      .returning();
    return results[0];
  }
  
  // Neighborhood Amenity methods
  async getAmenitiesByNeighborhood(neighborhoodId: number): Promise<(Amenity & { distance: number })[]> {
    // First get the neighborhood to get its coordinates
    const neighborhoodResult = await db.select().from(neighborhoods).where(eq(neighborhoods.id, neighborhoodId));
    
    if (neighborhoodResult.length === 0) {
      return [];
    }
    
    const neighborhood = neighborhoodResult[0];
    
    // Get all amenity IDs associated with this neighborhood
    const neighborhoodAmenityRecords = await db.select()
      .from(neighborhoodAmenities)
      .where(eq(neighborhoodAmenities.neighborhoodId, neighborhoodId));
    
    if (neighborhoodAmenityRecords.length === 0) {
      return [];
    }
    
    const amenityIds = neighborhoodAmenityRecords.map(record => record.amenityId);
    
    // Get all amenities
    const amenityRecords = await db.select()
      .from(amenities)
      .where(sql`${amenities.id} IN (${amenityIds.join(',')})`);
    
    // Calculate distance for each amenity
    return amenityRecords.map(amenity => {
      const distance = calculateDistance(
        neighborhood.latitude,
        neighborhood.longitude,
        amenity.latitude,
        amenity.longitude
      );
      
      return {
        ...amenity,
        distance
      };
    });
  }

  async getNearbyAmenities(latitude: number, longitude: number, radius: number): Promise<Amenity[]> {
    // Get all amenities
    const allAmenities = await db.select().from(amenities);
    
    // Filter amenities by radius
    return allAmenities.filter(amenity => {
      const distance = calculateDistance(
        latitude,
        longitude,
        amenity.latitude,
        amenity.longitude
      );
      
      return distance <= radius;
    });
  }

  async addAmenityToNeighborhood(neighborhoodAmenity: InsertNeighborhoodAmenity): Promise<NeighborhoodAmenity> {
    const results = await db.insert(neighborhoodAmenities)
      .values(neighborhoodAmenity)
      .returning();
    return results[0];
  }

  async removeAmenityFromNeighborhood(neighborhoodId: number, amenityId: number): Promise<boolean> {
    const results = await db.delete(neighborhoodAmenities)
      .where(
        and(
          eq(neighborhoodAmenities.neighborhoodId, neighborhoodId),
          eq(neighborhoodAmenities.amenityId, amenityId)
        )
      );
    // Just check if the operation was executed successfully
    return true;
  }
}