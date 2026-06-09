import { Router } from "express";
import { db, reviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateReviewBody,
  ApproveReviewParams,
  ApproveReviewBody,
  ListReviewsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/reviews", async (req, res) => {
  const parsed = ListReviewsQueryParams.safeParse(req.query);
  let query = db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt)).$dynamic();
  if (parsed.success && parsed.data.approved != null) {
    query = query.where(eq(reviewsTable.approved, parsed.data.approved));
  } else {
    query = query.where(eq(reviewsTable.approved, true));
  }
  let reviews = await query;
  if (parsed.success && parsed.data.limit != null) {
    reviews = reviews.slice(0, parsed.data.limit);
  }
  return res.json(reviews);
});

router.post("/reviews", async (req, res) => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, approved: false })
    .returning();
  return res.status(201).json(review);
});

router.get("/reviews/stats", async (req, res) => {
  const all = await db.select().from(reviewsTable).where(eq(reviewsTable.approved, true));
  const totalCount = all.length;
  const averageRating = totalCount > 0
    ? all.reduce((sum, r) => sum + r.rating, 0) / totalCount
    : 0;
  const ratingBreakdown: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  all.forEach(r => { ratingBreakdown[String(r.rating)] = (ratingBreakdown[String(r.rating)] || 0) + 1; });
  return res.json({
    averageRating: Math.round(averageRating * 10) / 10,
    totalCount,
    approvedCount: totalCount,
    ratingBreakdown,
  });
});

router.patch("/reviews/:id/approve", async (req, res) => {
  const params = ApproveReviewParams.safeParse({ id: Number(req.params.id) });
  const body = ApproveReviewBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [review] = await db
    .update(reviewsTable)
    .set({ approved: body.data.approved })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) return res.status(404).json({ error: "Not found" });
  return res.json(review);
});

export default router;
