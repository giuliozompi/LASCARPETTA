import { pgTable, serial, text, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  titleRu: text("title_ru").notNull(),
  titleIt: text("title_it").notNull(),
  titleEn: text("title_en").notNull(),
  titleFr: text("title_fr").notNull(),
  titleZh: text("title_zh").notNull(),
  descRu: text("desc_ru").notNull().default(""),
  descIt: text("desc_it").notNull().default(""),
  descEn: text("desc_en").notNull().default(""),
  descFr: text("desc_fr").notNull().default(""),
  descZh: text("desc_zh").notNull().default(""),
  date: date("date", { mode: "string" }).notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(true),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
