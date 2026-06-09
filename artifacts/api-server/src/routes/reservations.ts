import { Router } from "express";
import { db, reservationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateReservationBody,
  GetReservationParams,
  UpdateReservationStatusParams,
  UpdateReservationStatusBody,
  ListReservationsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/reservations", async (req, res) => {
  const parsed = ListReservationsQueryParams.safeParse(req.query);
  let query = db.select().from(reservationsTable).orderBy(desc(reservationsTable.createdAt)).$dynamic();
  if (parsed.success && parsed.data.status != null) {
    query = query.where(eq(reservationsTable.status, parsed.data.status));
  }
  if (parsed.success && parsed.data.date != null) {
    query = query.where(eq(reservationsTable.date, parsed.data.date));
  }
  return res.json(await query);
});

router.post("/reservations", async (req, res) => {
  const parsed = CreateReservationBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [reservation] = await db
    .insert(reservationsTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();
  return res.status(201).json(reservation);
});

router.get("/reservations/stats", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const weekAhead = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const all = await db.select().from(reservationsTable);
  const pending = all.filter(r => r.status === "pending").length;
  const confirmed = all.filter(r => r.status === "confirmed").length;
  const todayCount = all.filter(r => r.date === today).length;
  const thisWeekCount = all.filter(r => r.date >= today && r.date <= weekAhead).length;
  return res.json({ total: all.length, pending, confirmed, todayCount, thisWeekCount });
});

router.get("/reservations/:id", async (req, res) => {
  const params = GetReservationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  const [r] = await db.select().from(reservationsTable).where(eq(reservationsTable.id, params.data.id));
  if (!r) return res.status(404).json({ error: "Not found" });
  return res.json(r);
});

router.patch("/reservations/:id", async (req, res) => {
  const params = UpdateReservationStatusParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateReservationStatusBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [r] = await db
    .update(reservationsTable)
    .set(body.data)
    .where(eq(reservationsTable.id, params.data.id))
    .returning();
  if (!r) return res.status(404).json({ error: "Not found" });
  return res.json(r);
});

export default router;
