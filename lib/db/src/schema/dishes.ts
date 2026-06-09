import { pgTable, serial, text, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dishesTable = pgTable("dishes", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  nameRu: text("name_ru").notNull(),
  nameIt: text("name_it").notNull(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr").notNull(),
  nameZh: text("name_zh").notNull(),
  descRu: text("desc_ru").notNull().default(""),
  descIt: text("desc_it").notNull().default(""),
  descEn: text("desc_en").notNull().default(""),
  descFr: text("desc_fr").notNull().default(""),
  descZh: text("desc_zh").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("RUB"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  available: boolean("available").notNull().default(true),
  allergens: text("allergens"),
});

export const insertDishSchema = createInsertSchema(dishesTable).omit({ id: true });
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishesTable.$inferSelect;
