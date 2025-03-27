import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (already defined, keeping it for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Property schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
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
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  imageUrl: text("image_url").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
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
