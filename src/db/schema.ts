import { pgTable, serial, text, boolean, timestamp, decimal, integer, json, foreignKey, uuid } from "drizzle-orm/pg-core";

export const organizations = pgTable("organization", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  userId: uuid("user_id"),
  active: boolean("active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: uuid("auth_id").unique(),
  name: text("name").notNull(),
  organizationId: integer("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  email: text("email").unique().notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  // Password and rememberToken are managed by Supabase Auth, but keeping fields if you really want to store something else
  // password: text("password"), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(), // Mapped from team_id
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price"),
  order: integer("order").default(0),
  isVegan: boolean("is_vegan").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  ingredients: text("ingredients"),
  calories: integer("calories"),
  allergens: text("allergens"),
  portionSize: text("portion_size"),
  spiceLevel: integer("spice_level"),
  chefNotes: text("chef_notes"),
  tags: json("tags"),
  images: json("images"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dishCategories = pgTable("dish_categories", {
  id: serial("id").primaryKey(),
  dishId: integer("dish_id").references(() => dishes.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

