# LocalFind – Community Business Directory

A full-stack directory platform MVP built with **Bun**, **Elysia**, **SQLite**, **React**, **Vite**, and **Tailwind CSS**.

## Features

- **Listing cards** – name, category, location, description, and tags
- **Search bar** – filters by name, category, description, or tags
- **Category sidebar** – click-to-filter with live listing counts
- **Listing detail page** – full info with contact/location sidebar
- **Admin panel** (`/admin`) – add, edit, and delete listings and categories
- **20 seed listings** across 5 categories (Restaurants, Shops, Services, Entertainment, Health)
- No authentication required for MVP

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Runtime  | [Bun](https://bun.sh) v1.x      |
| Backend  | [Elysia](https://elysiajs.com)  |
| Database | SQLite via `bun:sqlite`         |
| Frontend | React 18 + React Router v6      |
| Build    | Vite                            |
| Styling  | Tailwind CSS v3                 |

## Project Structure

```
directory-platform/
├── server/
│   ├── src/
│   │   ├── index.ts          # Elysia app entry point
│   │   ├── db/index.ts       # SQLite schema & types
│   │   ├── routes/
│   │   │   ├── listings.ts   # GET/POST/PUT/DELETE /api/listings
│   │   │   └── categories.ts # GET/POST/PUT/DELETE /api/categories
│   │   └── seed.ts           # 20 realistic seed listings
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.tsx           # Route definitions
│   │   ├── components/       # Navbar, ListingCard, CategorySidebar
│   │   ├── pages/            # Home, Detail, Admin pages
│   │   └── lib/              # API client, shared types
│   ├── vite.config.ts
│   └── package.json
└── package.json              # Bun workspaces root
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0 or later

### Install dependencies

```bash
bun install
```

### Seed the database

```bash
bun run seed
```

This creates `server/data/directory.db` with 5 categories and 20 listings.

### Development (hot-reload)

```bash
bun run dev
```

- API server: `http://localhost:3000`
- Client dev server (with proxy): `http://localhost:5173`

### Production build

```bash
# Build the client
bun run build

# Start the server (serves built client + API)
bun run start
```

The production server serves everything from `http://localhost:3000`.

## API Reference

All endpoints are prefixed with `/api`.

### Categories

| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| GET    | `/categories`      | List all categories      |
| GET    | `/categories/:id`  | Get category by ID       |
| POST   | `/categories`      | Create category          |
| PUT    | `/categories/:id`  | Update category          |
| DELETE | `/categories/:id`  | Delete category (cascades to listings) |

### Listings

| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| GET    | `/listings`        | List/search listings     |
| GET    | `/listings/:slug`  | Get listing by slug      |
| POST   | `/listings`        | Create listing           |
| PUT    | `/listings/:id`    | Update listing           |
| DELETE | `/listings/:id`    | Delete listing           |

**GET `/listings` query parameters:**

| Parameter  | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| `search`   | string | Filter by name, category, description, or tags   |
| `category` | string | Filter by category slug                          |
| `page`     | number | Page number (default: 1)                         |
| `limit`    | number | Results per page, max 100 (default: 20)          |

## Seed Data

The seed script (`bun run seed`) populates the database with 20 businesses:

| Category      | Listings                                                            |
|---------------|---------------------------------------------------------------------|
| Restaurants   | Trattoria Bella Napoli, El Rancho Taqueria, Sakura Sushi & Ramen, Smoke & Ember BBQ |
| Shops         | The Wandering Page Bookstore, Revival Vintage Collective, Circuit & Spark Electronics, Greenfield Farmers Market |
| Services      | Reliable Plumbing Co., Studio Luxe Hair Salon, Prestige Auto Repair, Clarity Accounting Group |
| Entertainment | Starlight Cinema 8, Kingpin Bowling & Arcade, Mind Heist Escape Rooms, The Blue Note Lounge |
| Health        | Sunrise Yoga & Wellness, Bright Smile Dental Clinic, MediQuick Pharmacy, Iron & Grace Fitness |
