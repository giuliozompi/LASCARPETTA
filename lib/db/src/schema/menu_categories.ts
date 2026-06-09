import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const menuCategoriesTable = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameRu: text("name_ru").notNull(),
  nameIt: text("name_it").notNull(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr").notNull(),
  nameZh: text("name_zh").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategoriesTable).omit({ id: true });
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuCategory = typeof menuCategoriesTable.$inferSelect;
