import { supabase } from "./db";
import type {
  User,
  InsertUser,
  Property,
  InsertProperty,
  Agent,
  InsertAgent,
  Testimonial,
  InsertTestimonial,
  WaitlistEntry,
  InsertWaitlistEntry,
  Message,
  InsertMessage,
  SavedProperty,
  InsertSavedProperty,
  Neighborhood,
  InsertNeighborhood,
  AmenityCategory,
  InsertAmenityCategory,
  Amenity,
  InsertAmenity,
  NeighborhoodAmenity,
  InsertNeighborhoodAmenity,
  PropertyNeighborhood,
  InsertPropertyNeighborhood,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;

  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  getPropertiesByFilters(filters: {
    location?: string;
    propertyType?: string;
    listingType?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    ownerId?: number;
  }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(
    id: number,
    propertyData: Partial<InsertProperty>
  ): Promise<Property | undefined>;
  updatePropertyStatus(id: number, status: string): Promise<Property | undefined>;

  getMessagesByUser(userId: number): Promise<Message[]>;
  getMessagesBetweenUsers(
    user1Id: number,
    user2Id: number
  ): Promise<Message[]>;
  getMessagesByProperty(propertyId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number): Promise<Message | undefined>;

  getSavedPropertiesByUser(userId: number): Promise<SavedProperty[]>;
  saveProperty(savedProperty: InsertSavedProperty): Promise<SavedProperty>;
  removeSavedProperty(userId: number, propertyId: number): Promise<boolean>;

  getAllAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;

  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;

  getAllNeighborhoods(): Promise<Neighborhood[]>;
  getNeighborhood(id: number): Promise<Neighborhood | undefined>;
  getNeighborhoodsByCity(city: string): Promise<Neighborhood[]>;
  createNeighborhood(neighborhood: InsertNeighborhood): Promise<Neighborhood>;
  updateNeighborhood(
    id: number,
    data: Partial<InsertNeighborhood>
  ): Promise<Neighborhood | undefined>;

  getNeighborhoodsByProperty(propertyId: number): Promise<Neighborhood[]>;
  addPropertyToNeighborhood(
    propertyNeighborhood: InsertPropertyNeighborhood
  ): Promise<PropertyNeighborhood>;
  removePropertyFromNeighborhood(
    propertyId: number,
    neighborhoodId: number
  ): Promise<boolean>;

  getAllAmenityCategories(): Promise<AmenityCategory[]>;
  getAmenityCategory(id: number): Promise<AmenityCategory | undefined>;
  createAmenityCategory(
    category: InsertAmenityCategory
  ): Promise<AmenityCategory>;

  getAllAmenities(): Promise<Amenity[]>;
  getAmenity(id: number): Promise<Amenity | undefined>;
  getAmenitiesByCategory(categoryId: number): Promise<Amenity[]>;
  createAmenity(amenity: InsertAmenity): Promise<Amenity>;
  updateAmenity(
    id: number,
    data: Partial<InsertAmenity>
  ): Promise<Amenity | undefined>;

  getAmenitiesByNeighborhood(
    neighborhoodId: number
  ): Promise<(Amenity & { distance: number })[]>;
  getNearbyAmenities(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Amenity[]>;
  addAmenityToNeighborhood(
    neighborhoodAmenity: InsertNeighborhoodAmenity
  ): Promise<NeighborhoodAmenity>;
  removeAmenityFromNeighborhood(
    neighborhoodId: number,
    amenityId: number
  ): Promise<boolean>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { data } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
    return data as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    return data as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    return data as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([insertUser])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async updateUser(
    id: number,
    userData: Partial<InsertUser>
  ): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as User | undefined;
  }

  async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase.from("properties").select("*");
    if (error) throw error;
    return (data || []) as Property[];
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as Property | undefined;
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("ownerId", ownerId);

    if (error) throw error;
    return (data || []) as Property[];
  }

  async getFeaturedProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("isFeatured", true)
      .eq("status", "active");

    if (error) throw error;
    return (data || []) as Property[];
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
    let query = supabase.from("properties").select("*");

    if (filters.location && filters.location !== "Any Location") {
      query = query.eq("city", filters.location);
    }

    if (filters.propertyType && filters.propertyType !== "Any Type") {
      query = query.eq("propertyType", filters.propertyType);
    }

    if (filters.listingType && filters.listingType !== "Any") {
      query = query.eq("listingType", filters.listingType);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.ownerId) {
      query = query.eq("ownerId", filters.ownerId);
    }

    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Property[];
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .insert([insertProperty])
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  }

  async updateProperty(
    id: number,
    propertyData: Partial<InsertProperty>
  ): Promise<Property | undefined> {
    const { data, error } = await supabase
      .from("properties")
      .update(propertyData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Property | undefined;
  }

  async updatePropertyStatus(id: number, status: string): Promise<Property | undefined> {
    const { data, error } = await supabase
      .from("properties")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Property | undefined;
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`senderId.eq.${userId},receiverId.eq.${userId}`);

    if (error) throw error;
    return (data || []) as Message[];
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(senderId.eq.${user1Id},receiverId.eq.${user2Id}),and(senderId.eq.${user2Id},receiverId.eq.${user1Id})`
      )
      .order("createdAt", { ascending: true });

    if (error) throw error;
    return (data || []) as Message[];
  }

  async getMessagesByProperty(propertyId: number): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("propertyId", propertyId);

    if (error) throw error;
    return (data || []) as Message[];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .insert([insertMessage])
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  }

  async markMessageAsRead(messageId: number): Promise<Message | undefined> {
    const { data, error } = await supabase
      .from("messages")
      .update({ isRead: true })
      .eq("id", messageId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Message | undefined;
  }

  async getSavedPropertiesByUser(userId: number): Promise<SavedProperty[]> {
    const { data, error } = await supabase
      .from("savedProperties")
      .select("*")
      .eq("userId", userId);

    if (error) throw error;
    return (data || []) as SavedProperty[];
  }

  async saveProperty(savedProperty: InsertSavedProperty): Promise<SavedProperty> {
    const { data, error } = await supabase
      .from("savedProperties")
      .insert([savedProperty])
      .select()
      .single();

    if (error) throw error;
    return data as SavedProperty;
  }

  async removeSavedProperty(userId: number, propertyId: number): Promise<boolean> {
    const { error } = await supabase
      .from("savedProperties")
      .delete()
      .eq("userId", userId)
      .eq("propertyId", propertyId);

    if (error) throw error;
    return true;
  }

  async getAllAgents(): Promise<Agent[]> {
    const { data, error } = await supabase.from("agents").select("*");
    if (error) throw error;
    return (data || []) as Agent[];
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as Agent | undefined;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const { data, error } = await supabase
      .from("agents")
      .insert([insertAgent])
      .select()
      .single();

    if (error) throw error;
    return data as Agent;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (error) throw error;
    return (data || []) as Testimonial[];
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const { data, error } = await supabase
      .from("testimonials")
      .insert([insertTestimonial])
      .select()
      .single();

    if (error) throw error;
    return data as Testimonial;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const { data, error } = await supabase
      .from("waitlistEntries")
      .insert([insertEntry])
      .select()
      .single();

    if (error) throw error;
    return data as WaitlistEntry;
  }

  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    const { data, error } = await supabase.from("neighborhoods").select("*");
    if (error) throw error;
    return (data || []) as Neighborhood[];
  }

  async getNeighborhood(id: number): Promise<Neighborhood | undefined> {
    const { data, error } = await supabase
      .from("neighborhoods")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as Neighborhood | undefined;
  }

  async getNeighborhoodsByCity(city: string): Promise<Neighborhood[]> {
    const { data, error } = await supabase
      .from("neighborhoods")
      .select("*")
      .eq("city", city);

    if (error) throw error;
    return (data || []) as Neighborhood[];
  }

  async createNeighborhood(insertNeighborhood: InsertNeighborhood): Promise<Neighborhood> {
    const { data, error } = await supabase
      .from("neighborhoods")
      .insert([insertNeighborhood])
      .select()
      .single();

    if (error) throw error;
    return data as Neighborhood;
  }

  async updateNeighborhood(
    id: number,
    data: Partial<InsertNeighborhood>
  ): Promise<Neighborhood | undefined> {
    const { data: result, error } = await supabase
      .from("neighborhoods")
      .update(data)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return result as Neighborhood | undefined;
  }

  async getNeighborhoodsByProperty(propertyId: number): Promise<Neighborhood[]> {
    const { data, error } = await supabase
      .from("propertyNeighborhoods")
      .select("neighborhoods(*)")
      .eq("propertyId", propertyId);

    if (error) throw error;
    return (data || []).map((row: any) => row.neighborhoods) as Neighborhood[];
  }

  async addPropertyToNeighborhood(
    propertyNeighborhood: InsertPropertyNeighborhood
  ): Promise<PropertyNeighborhood> {
    const { data, error } = await supabase
      .from("propertyNeighborhoods")
      .insert([propertyNeighborhood])
      .select()
      .single();

    if (error) throw error;
    return data as PropertyNeighborhood;
  }

  async removePropertyFromNeighborhood(
    propertyId: number,
    neighborhoodId: number
  ): Promise<boolean> {
    const { error } = await supabase
      .from("propertyNeighborhoods")
      .delete()
      .eq("propertyId", propertyId)
      .eq("neighborhoodId", neighborhoodId);

    if (error) throw error;
    return true;
  }

  async getAllAmenityCategories(): Promise<AmenityCategory[]> {
    const { data, error } = await supabase.from("amenityCategories").select("*");
    if (error) throw error;
    return (data || []) as AmenityCategory[];
  }

  async getAmenityCategory(id: number): Promise<AmenityCategory | undefined> {
    const { data, error } = await supabase
      .from("amenityCategories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as AmenityCategory | undefined;
  }

  async createAmenityCategory(
    insertCategory: InsertAmenityCategory
  ): Promise<AmenityCategory> {
    const { data, error } = await supabase
      .from("amenityCategories")
      .insert([insertCategory])
      .select()
      .single();

    if (error) throw error;
    return data as AmenityCategory;
  }

  async getAllAmenities(): Promise<Amenity[]> {
    const { data, error } = await supabase.from("amenities").select("*");
    if (error) throw error;
    return (data || []) as Amenity[];
  }

  async getAmenity(id: number): Promise<Amenity | undefined> {
    const { data, error } = await supabase
      .from("amenities")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as Amenity | undefined;
  }

  async getAmenitiesByCategory(categoryId: number): Promise<Amenity[]> {
    const { data, error } = await supabase
      .from("amenities")
      .select("*")
      .eq("categoryId", categoryId);

    if (error) throw error;
    return (data || []) as Amenity[];
  }

  async createAmenity(insertAmenity: InsertAmenity): Promise<Amenity> {
    const { data, error } = await supabase
      .from("amenities")
      .insert([insertAmenity])
      .select()
      .single();

    if (error) throw error;
    return data as Amenity;
  }

  async updateAmenity(
    id: number,
    data: Partial<InsertAmenity>
  ): Promise<Amenity | undefined> {
    const { data: result, error } = await supabase
      .from("amenities")
      .update(data)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return result as Amenity | undefined;
  }

  async getAmenitiesByNeighborhood(
    neighborhoodId: number
  ): Promise<(Amenity & { distance: number })[]> {
    const { data, error } = await supabase
      .from("neighborhoodAmenities")
      .select("amenities(*), distance")
      .eq("neighborhoodId", neighborhoodId);

    if (error) throw error;
    return (data || []).map((row: any) => ({
      ...row.amenities,
      distance: row.distance,
    })) as (Amenity & { distance: number })[];
  }

  async getNearbyAmenities(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Amenity[]> {
    const { data, error } = await supabase.rpc("get_nearby_amenities", {
      lat: latitude,
      lng: longitude,
      rad: radius,
    });

    if (error) throw error;
    return (data || []) as Amenity[];
  }

  async addAmenityToNeighborhood(
    neighborhoodAmenity: InsertNeighborhoodAmenity
  ): Promise<NeighborhoodAmenity> {
    const { data, error } = await supabase
      .from("neighborhoodAmenities")
      .insert([neighborhoodAmenity])
      .select()
      .single();

    if (error) throw error;
    return data as NeighborhoodAmenity;
  }

  async removeAmenityFromNeighborhood(
    neighborhoodId: number,
    amenityId: number
  ): Promise<boolean> {
    const { error } = await supabase
      .from("neighborhoodAmenities")
      .delete()
      .eq("neighborhoodId", neighborhoodId)
      .eq("amenityId", amenityId);

    if (error) throw error;
    return true;
  }
}

export const storage = new SupabaseStorage();
