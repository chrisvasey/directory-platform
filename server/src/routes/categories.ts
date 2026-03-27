import { Elysia, t } from "elysia";
import { db } from "../db";

export const categoriesRouter = new Elysia({ prefix: "/categories" })
  .get("/", () => {
    const rows = db.query(`
      SELECT c.*, COUNT(l.id) as listing_count
      FROM categories c
      LEFT JOIN listings l ON l.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name
    `).all();
    return rows;
  })

  .get("/:id", ({ params, error }) => {
    const row = db.query("SELECT * FROM categories WHERE id = $id").get({ $id: params.id });
    if (!row) return error(404, { message: "Category not found" });
    return row;
  }, { params: t.Object({ id: t.Numeric() }) })

  .post("/", ({ body, error }) => {
    const { name, slug, description, icon } = body;
    const existing = db.query("SELECT id FROM categories WHERE slug = $slug").get({ $slug: slug });
    if (existing) return error(409, { message: "Category slug already exists" });
    const result = db.query(`
      INSERT INTO categories (name, slug, description, icon)
      VALUES ($name, $slug, $description, $icon)
      RETURNING *
    `).get({ $name: name, $slug: slug, $description: description ?? null, $icon: icon ?? "📁" });
    return result;
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      slug: t.String({ minLength: 1 }),
      description: t.Optional(t.String()),
      icon: t.Optional(t.String()),
    })
  })

  .put("/:id", ({ params, body, error }) => {
    const existing = db.query("SELECT id FROM categories WHERE id = $id").get({ $id: params.id });
    if (!existing) return error(404, { message: "Category not found" });
    const { name, slug, description, icon } = body;
    const result = db.query(`
      UPDATE categories SET name=$name, slug=$slug, description=$description, icon=$icon
      WHERE id=$id RETURNING *
    `).get({ $id: params.id, $name: name, $slug: slug, $description: description ?? null, $icon: icon ?? "📁" });
    return result;
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Object({
      name: t.String({ minLength: 1 }),
      slug: t.String({ minLength: 1 }),
      description: t.Optional(t.String()),
      icon: t.Optional(t.String()),
    })
  })

  .delete("/:id", ({ params, error }) => {
    const existing = db.query("SELECT id FROM categories WHERE id = $id").get({ $id: params.id });
    if (!existing) return error(404, { message: "Category not found" });
    db.query("DELETE FROM categories WHERE id = $id").run({ $id: params.id });
    return { success: true };
  }, { params: t.Object({ id: t.Numeric() }) });
