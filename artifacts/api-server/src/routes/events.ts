import { Router } from "express";
import { db, eventsTable } from "@workspace/db";
import { eq, desc, gte } from "drizzle-orm";
import {
  CreateEventBody,
  GetEventParams,
  UpdateEventParams,
  UpdateEventBody,
  DeleteEventParams,
  ListEventsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/events", async (req, res) => {
  const parsed = ListEventsQueryParams.safeParse(req.query);
  const today = new Date().toISOString().split("T")[0];
  let query = db.select().from(eventsTable).where(eq(eventsTable.published, true)).orderBy(desc(eventsTable.date)).$dynamic();
  if (parsed.success && parsed.data.upcoming === true) {
    query = query.where(gte(eventsTable.date, today));
  }
  return res.json(await query);
});

router.post("/events", async (req, res) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [event] = await db.insert(eventsTable).values(parsed.data).returning();
  return res.status(201).json(event);
});

router.get("/events/:id", async (req, res) => {
  const params = GetEventParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, params.data.id));
  if (!event) return res.status(404).json({ error: "Not found" });
  return res.json(event);
});

router.put("/events/:id", async (req, res) => {
  const params = UpdateEventParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateEventBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [event] = await db
    .update(eventsTable)
    .set(body.data)
    .where(eq(eventsTable.id, params.data.id))
    .returning();
  if (!event) return res.status(404).json({ error: "Not found" });
  return res.json(event);
});

router.delete("/events/:id", async (req, res) => {
  const params = DeleteEventParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  await db.delete(eventsTable).where(eq(eventsTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
