import { Router } from "express";
import { db, menuCategoriesTable, dishesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateMenuCategoryBody,
  UpdateMenuCategoryBody,
  UpdateMenuCategoryParams,
  DeleteMenuCategoryParams,
  CreateDishBody,
  GetDishParams,
  UpdateDishBody,
  UpdateDishParams,
  DeleteDishParams,
  ListDishesQueryParams,
} from "@workspace/api-zod";

const router = Router();

// Categories
router.get("/menu/categories", async (req, res) => {
  const cats = await db
    .select()
    .from(menuCategoriesTable)
    .orderBy(asc(menuCategoriesTable.sortOrder));
  return res.json(cats);
});

router.post("/menu/categories", async (req, res) => {
  const parsed = CreateMenuCategoryBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [cat] = await db.insert(menuCategoriesTable).values(parsed.data).returning();
  return res.status(201).json(cat);
});

router.put("/menu/categories/:id", async (req, res) => {
  const params = UpdateMenuCategoryParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateMenuCategoryBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [cat] = await db
    .update(menuCategoriesTable)
    .set(body.data)
    .where(eq(menuCategoriesTable.id, params.data.id))
    .returning();
  if (!cat) return res.status(404).json({ error: "Not found" });
  return res.json(cat);
});

router.delete("/menu/categories/:id", async (req, res) => {
  const params = DeleteMenuCategoryParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  await db.delete(menuCategoriesTable).where(eq(menuCategoriesTable.id, params.data.id));
  return res.status(204).send();
});

// Featured dishes — must be before /dishes/:id
router.get("/menu/featured", async (req, res) => {
  const dishes = await db
    .select()
    .from(dishesTable)
    .where(eq(dishesTable.featured, true));
  return res.json(dishes);
});

// Dishes list
router.get("/menu/dishes", async (req, res) => {
  const parsed = ListDishesQueryParams.safeParse(req.query);
  let query = db.select().from(dishesTable).$dynamic();
  if (parsed.success && parsed.data.categoryId != null) {
    query = query.where(eq(dishesTable.categoryId, parsed.data.categoryId));
  }
  if (parsed.success && parsed.data.featured != null) {
    query = query.where(eq(dishesTable.featured, parsed.data.featured));
  }
  const dishes = await query;
  return res.json(dishes);
});

router.post("/menu/dishes", async (req, res) => {
  const parsed = CreateDishBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [dish] = await db.insert(dishesTable).values(parsed.data as any).returning();
  return res.status(201).json(dish);
});

router.get("/menu/dishes/:id", async (req, res) => {
  const params = GetDishParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  const [dish] = await db.select().from(dishesTable).where(eq(dishesTable.id, params.data.id));
  if (!dish) return res.status(404).json({ error: "Not found" });
  return res.json(dish);
});

router.put("/menu/dishes/:id", async (req, res) => {
  const params = UpdateDishParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateDishBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  const [dish] = await db
    .update(dishesTable)
    .set(body.data as any)
    .where(eq(dishesTable.id, params.data.id))
    .returning();
  if (!dish) return res.status(404).json({ error: "Not found" });
  return res.json(dish);
});

router.delete("/menu/dishes/:id", async (req, res) => {
  const params = DeleteDishParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid input" });
  await db.delete(dishesTable).where(eq(dishesTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
