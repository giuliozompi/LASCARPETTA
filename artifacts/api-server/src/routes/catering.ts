import { Router } from "express";
import { db, cateringMenusTable, cateringBookingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateCateringMenuBody,
  UpdateCateringMenuParams,
  UpdateCateringMenuBody,
  DeleteCateringMenuParams,
  CreateCateringBookingBody,
  UpdateCateringBookingStatusParams,
  UpdateCateringBookingStatusBody,
  ListCateringBookingsQueryParams,
} from "@workspace/api-zod";

const router = Router();

// Catering menus
router.get("/catering/menus", async (req, res) => {
  const menus = await db
    .select()
    .from(cateringMenusTable)
    .where(eq(cateringMenusTable.active, true));
  return res.json(menus);
});

router.post("/catering/menus", async (req, res) => {
  const parsed = CreateCateringMenuBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [menu] = await db.insert(cateringMenusTable).values(parsed.data as any).returning();
  return res.status(201).json(menu);
});

router.put("/catering/menus/:id", async (req, res) => {
  const params = UpdateCateringMenuParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateCateringMenuBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [menu] = await db
    .update(cateringMenusTable)
    .set(body.data as any)
    .where(eq(cateringMenusTable.id, params.data.id))
    .returning();
  if (!menu) return res.status(404).json({ error: "Not found" });
  return res.json(menu);
});

router.delete("/catering/menus/:id", async (req, res) => {
  const params = DeleteCateringMenuParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  await db.delete(cateringMenusTable).where(eq(cateringMenusTable.id, params.data.id));
  return res.status(204).send();
});

// Catering bookings
router.get("/catering/bookings", async (req, res) => {
  const parsed = ListCateringBookingsQueryParams.safeParse(req.query);
  let query = db.select().from(cateringBookingsTable).orderBy(desc(cateringBookingsTable.createdAt)).$dynamic();
  if (parsed.success && parsed.data.status != null) {
    query = query.where(eq(cateringBookingsTable.status, parsed.data.status));
  }
  return res.json(await query);
});

router.post("/catering/bookings", async (req, res) => {
  const parsed = CreateCateringBookingBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [booking] = await db
    .insert(cateringBookingsTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();
  return res.status(201).json(booking);
});

router.patch("/catering/bookings/:id", async (req, res) => {
  const params = UpdateCateringBookingStatusParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateCateringBookingStatusBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [booking] = await db
    .update(cateringBookingsTable)
    .set(body.data)
    .where(eq(cateringBookingsTable.id, params.data.id))
    .returning();
  if (!booking) return res.status(404).json({ error: "Not found" });
  return res.json(booking);
});

export default router;
