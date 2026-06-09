import { Router, type Request } from "express";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

function getSession(req: Request): Record<string, unknown> {
  return (req as any).session as Record<string, unknown>;
}

router.post("/admin/login", async (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { username, password } = parsed.data;
  const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.username, username));
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  getSession(req).adminUsername = username;
  return res.json({ authenticated: true, username });
});

router.post("/admin/logout", (req, res) => {
  (req as any).session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/admin/me", (req, res) => {
  const session = getSession(req);
  if (!session.adminUsername) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return res.json({ authenticated: true, username: session.adminUsername });
});

export default router;
