import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // dishes | interior | events | daily
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  captionRu: text("caption_ru").notNull().default(""),
  captionIt: text("caption_it").notNull().default(""),
  captionEn: text("caption_en").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotosTable).omit({ id: true, createdAt: true });
export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
export type GalleryPhoto = typeof galleryPhotosTable.$inferSelect;
