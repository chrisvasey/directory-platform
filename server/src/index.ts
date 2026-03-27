import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { initDb } from "./db";
import { categoriesRouter } from "./routes/categories";
import { listingsRouter } from "./routes/listings";
import { existsSync } from "fs";
import { join } from "path";

initDb();

const DIST_PATH = join(import.meta.dir, "../../client/dist");
const hasClientBuild = existsSync(DIST_PATH);

const app = new Elysia()
  .use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }))
  .group("/api", (app) =>
    app
      .use(categoriesRouter)
      .use(listingsRouter)
  );

if (hasClientBuild) {
  app.use(staticPlugin({ assets: DIST_PATH, prefix: "/" }));
  app.get("*", () => Bun.file(join(DIST_PATH, "index.html")));
}

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  if (hasClientBuild) console.log("   Serving built client from /client/dist");
  else console.log("   API only mode (run client dev server separately)");
});

export type App = typeof app;
