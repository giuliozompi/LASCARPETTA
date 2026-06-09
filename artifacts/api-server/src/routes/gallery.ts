import { Router } from "express";
import { db, galleryPhotosTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import {
  CreateGalleryPhotoBody,
  UpdateGalleryPhotoParams,
  UpdateGalleryPhotoBody,
  DeleteGalleryPhotoParams,
  ListGalleryPhotosQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/gallery", async (req, res) => {
  const parsed = ListGalleryPhotosQueryParams.safeParse(req.query);
  let query = db
    .select()
    .from(galleryPhotosTable)
    .orderBy(asc(galleryPhotosTable.sortOrder), desc(galleryPhotosTable.createdAt))
    .$dynamic();
  if (parsed.success && parsed.data.type != null) {
    query = query.where(eq(galleryPhotosTable.type, parsed.data.type));
  }
  const photos = await query;
  const limit = parsed.success && parsed.data.limit != null ? parsed.data.limit : undefined;
  return res.json(limit ? photos.slice(0, limit) : photos);
});

router.post("/gallery", async (req, res) => {
  const parsed = CreateGalleryPhotoBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [photo] = await db.insert(galleryPhotosTable).values(parsed.data).returning();
  return res.status(201).json(photo);
});

router.put("/gallery/:id", async (req, res) => {
  const params = UpdateGalleryPhotoParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateGalleryPhotoBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [photo] = await db
    .update(galleryPhotosTable)
    .set(body.data)
    .where(eq(galleryPhotosTable.id, params.data.id))
    .returning();
  if (!photo) return res.status(404).json({ error: "Not found" });
  return res.json(photo);
});

router.delete("/gallery/:id", async (req, res) => {
  const params = DeleteGalleryPhotoParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
