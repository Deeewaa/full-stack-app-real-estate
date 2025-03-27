import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // "rent_buy" or "landlord_sell"
  phoneNumber: text("phone_number"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true, 
  fullName: true,
  userType: true,
  phoneNumber: true,
  bio: true,
  profileImage: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Property schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  propertyType: text("property_type").notNull(),
  listingType: text("listing_type").notNull(), // "rent" or "sell"
  status: text("status").notNull().default("active"), // "active", "sold", "rented"
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    ownerIdFk: foreignKey({
      columns: [table.ownerId],
      foreignColumns: [users.id],
    }),
  };
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Agent schema
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  instagram: text("instagram"),
  linkedin: text("linkedin"),
  email: text("email").notNull(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// Testimonial schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Waitlist schema
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  propertyInterest: text("property_interest").notNull(),
  agreedToTerms: boolean("agreed_to_terms").notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).omit({
  id: true,
});

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  recipientId: integer("recipient_id").notNull(), 
  propertyId: integer("property_id"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    senderFk: foreignKey({
      columns: [table.senderId],
      foreignColumns: [users.id],
    }),
    recipientFk: foreignKey({
      columns: [table.recipientId],
      foreignColumns: [users.id],
    }),
    propertyFk: foreignKey({
      columns: [table.propertyId],
      foreignColumns: [properties.id],
    }),
  };
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Favorites/Saved Properties
export const savedProperties = pgTable("saved_properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    propertyFk: foreignKey({
      columns: [table.propertyId],
      foreignColumns: [properties.id],
    }),
  };
});

export const insertSavedPropertySchema = createInsertSchema(savedProperties).omit({
  id: true,
  createdAt: true,
});

export type InsertSavedProperty = z.infer<typeof insertSavedPropertySchema>;
export type SavedProperty = typeof savedProperties.$inferSelect;

// Neighborhood schema
export const neighborhoods = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  safetyRating: integer("safety_rating").notNull(),
  walkabilityScore: integer("walkability_score").notNull(),
  schoolRating: integer("school_rating").notNull(),
  imageUrl: text("image_url").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
});

export const insertNeighborhoodSchema = createInsertSchema(neighborhoods).omit({
  id: true,
});

export type InsertNeighborhood = z.infer<typeof insertNeighborhoodSchema>;
export type Neighborhood = typeof neighborhoods.$inferSelect;

// Amenity categories
export const amenityCategories = pgTable("amenity_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

export const insertAmenityCategorySchema = createInsertSchema(amenityCategories).omit({
  id: true,
});

export type InsertAmenityCategory = z.infer<typeof insertAmenityCategorySchema>;
export type AmenityCategory = typeof amenityCategories.$inferSelect;

// Amenities schema
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  website: text("website").notNull().default(""),
  phoneNumber: text("phone_number").notNull().default(""),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
}, (table) => {
  return {
    categoryFk: foreignKey({
      columns: [table.categoryId],
      foreignColumns: [amenityCategories.id],
    }),
  };
});

export const insertAmenitySchema = createInsertSchema(amenities).omit({
  id: true,
});

export type InsertAmenity = z.infer<typeof insertAmenitySchema>;
export type Amenity = typeof amenities.$inferSelect;

// Neighborhood amenities relation (many-to-many)
export const neighborhoodAmenities = pgTable("neighborhood_amenities", {
  id: serial("id").primaryKey(),
  neighborhoodId: integer("neighborhood_id").notNull(),
  amenityId: integer("amenity_id").notNull(),
  distance: doublePrecision("distance").notNull().default(0), // in kilometers
}, (table) => {
  return {
    neighborhoodFk: foreignKey({
      columns: [table.neighborhoodId],
      foreignColumns: [neighborhoods.id],
    }),
    amenityFk: foreignKey({
      columns: [table.amenityId],
      foreignColumns: [amenities.id],
    }),
  };
});

export const insertNeighborhoodAmenitySchema = createInsertSchema(neighborhoodAmenities).omit({
  id: true,
});

export type InsertNeighborhoodAmenity = z.infer<typeof insertNeighborhoodAmenitySchema>;
export type NeighborhoodAmenity = typeof neighborhoodAmenities.$inferSelect;

// Property neighborhood relation
export const propertyNeighborhoods = pgTable("property_neighborhoods", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  neighborhoodId: integer("neighborhood_id").notNull(),
}, (table) => {
  return {
    propertyFk: foreignKey({
      columns: [table.propertyId],
      foreignColumns: [properties.id],
    }),
    neighborhoodFk: foreignKey({
      columns: [table.neighborhoodId],
      foreignColumns: [neighborhoods.id],
    }),
  };
});

export const insertPropertyNeighborhoodSchema = createInsertSchema(propertyNeighborhoods).omit({
  id: true,
});

export type InsertPropertyNeighborhood = z.infer<typeof insertPropertyNeighborhoodSchema>;
export type PropertyNeighborhood = typeof propertyNeighborhoods.$inferSelect;
