import { pgTable, serial, text, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reservationsTable = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  date: date("date", { mode: "string" }).notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  status: text("status").notNull().default("pending"), // pending | confirmed | cancelled | completed
  comment: text("comment"),
  lang: text("lang").notNull().default("ru"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({ id: true, createdAt: true, status: true, adminNotes: true });
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservationsTable.$inferSelect;
