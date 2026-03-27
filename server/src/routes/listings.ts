import { Elysia, t } from "elysia";
import { db } from "../db";

const listingSelect = `
  SELECT l.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
  FROM listings l
  JOIN categories c ON c.id = l.category_id
`;

export const listingsRouter = new Elysia({ prefix: "/listings" })
  .get("/", ({ query }) => {
    const { search, category, page = "1", limit = "20" } = query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    let where = "WHERE 1=1";
    const params: Record<string, string | number> = {};

    if (search) {
      where += " AND (l.name LIKE $search OR c.name LIKE $search OR l.description LIKE $search OR l.tags LIKE $search)";
      params.$search = `%${search}%`;
    }
    if (category) {
      where += " AND c.slug = $category";
      params.$category = category as string;
    }

    const totalRow = db.query(`SELECT COUNT(*) as total FROM listings l JOIN categories c ON c.id = l.category_id ${where}`).get(params) as { total: number };
    const rows = db.query(`${listingSelect} ${where} ORDER BY l.name LIMIT ${limitNum} OFFSET ${offset}`).all(params);

    return {
      listings: rows,
      total: totalRow.total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalRow.total / limitNum),
    };
  }, {
    query: t.Object({
      search: t.Optional(t.String()),
      category: t.Optional(t.String()),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    })
  })

  .get("/:slug", ({ params, error }) => {
    const row = db.query(`${listingSelect} WHERE l.slug = $slug`).get({ $slug: params.slug });
    if (!row) return error(404, { message: "Listing not found" });
    return row;
  })

  .post("/", ({ body, error }) => {
    const { category_id, name, slug, location, description, tags, phone, email, website, image_url } = body;
    const catExists = db.query("SELECT id FROM categories WHERE id = $id").get({ $id: category_id });
    if (!catExists) return error(400, { message: "Category not found" });
    const slugExists = db.query("SELECT id FROM listings WHERE slug = $slug").get({ $slug: slug });
    if (slugExists) return error(409, { message: "Listing slug already exists" });

    const result = db.query(`
      INSERT INTO listings (category_id, name, slug, location, description, tags, phone, email, website, image_url)
      VALUES ($category_id, $name, $slug, $location, $description, $tags, $phone, $email, $website, $image_url)
      RETURNING *
    `).get({
      $category_id: category_id,
      $name: name,
      $slug: slug,
      $location: location ?? null,
      $description: description ?? null,
      $tags: JSON.stringify(tags ?? []),
      $phone: phone ?? null,
      $email: email ?? null,
      $website: website ?? null,
      $image_url: image_url ?? null,
    });
    return result;
  }, {
    body: t.Object({
      category_id: t.Number(),
      name: t.String({ minLength: 1 }),
      slug: t.String({ minLength: 1 }),
      location: t.Optional(t.String()),
      description: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String())),
      phone: t.Optional(t.String()),
      email: t.Optional(t.String()),
      website: t.Optional(t.String()),
      image_url: t.Optional(t.String()),
    })
  })

  .put("/:id", ({ params, body, error }) => {
    const existing = db.query("SELECT id FROM listings WHERE id = $id").get({ $id: params.id });
    if (!existing) return error(404, { message: "Listing not found" });
    const { category_id, name, slug, location, description, tags, phone, email, website, image_url } = body;

    const result = db.query(`
      UPDATE listings SET
        category_id=$category_id, name=$name, slug=$slug, location=$location,
        description=$description, tags=$tags, phone=$phone, email=$email,
        website=$website, image_url=$image_url, updated_at=datetime('now')
      WHERE id=$id RETURNING *
    `).get({
      $id: params.id,
      $category_id: category_id,
      $name: name,
      $slug: slug,
      $location: location ?? null,
      $description: description ?? null,
      $tags: JSON.stringify(tags ?? []),
      $phone: phone ?? null,
      $email: email ?? null,
      $website: website ?? null,
      $image_url: image_url ?? null,
    });
    return result;
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Object({
      category_id: t.Number(),
      name: t.String({ minLength: 1 }),
      slug: t.String({ minLength: 1 }),
      location: t.Optional(t.String()),
      description: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String())),
      phone: t.Optional(t.String()),
      email: t.Optional(t.String()),
      website: t.Optional(t.String()),
      image_url: t.Optional(t.String()),
    })
  })

  .delete("/:id", ({ params, error }) => {
    const existing = db.query("SELECT id FROM listings WHERE id = $id").get({ $id: params.id });
    if (!existing) return error(404, { message: "Listing not found" });
    db.query("DELETE FROM listings WHERE id = $id").run({ $id: params.id });
    return { success: true };
  }, { params: t.Object({ id: t.Numeric() }) });
