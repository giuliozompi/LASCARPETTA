import { pgTable, serial, text, integer, numeric, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cateringMenusTable = pgTable("catering_menus", {
  id: serial("id").primaryKey(),
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
  pricePerPerson: numeric("price_per_person", { precision: 10, scale: 2 }).notNull(),
  minGuests: integer("min_guests").notNull().default(10),
  maxGuests: integer("max_guests").notNull().default(200),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
});

export const insertCateringMenuSchema = createInsertSchema(cateringMenusTable).omit({ id: true });
export type InsertCateringMenu = z.infer<typeof insertCateringMenuSchema>;
export type CateringMenu = typeof cateringMenusTable.$inferSelect;

export const cateringBookingsTable = pgTable("catering_bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  eventLocation: text("event_location"),
  guests: integer("guests").notNull(),
  cateringMenuId: integer("catering_menu_id").notNull(),
  status: text("status").notNull().default("pending"), // pending | confirmed | cancelled
  comment: text("comment"),
  adminNotes: text("admin_notes"),
  lang: text("lang").notNull().default("ru"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCateringBookingSchema = createInsertSchema(cateringBookingsTable).omit({ id: true, createdAt: true, status: true, adminNotes: true });
export type InsertCateringBooking = z.infer<typeof insertCateringBookingSchema>;
export type CateringBooking = typeof cateringBookingsTable.$inferSelect;
