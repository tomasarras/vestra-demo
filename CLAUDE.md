# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Vestra is a fictional clothing store demo (portfolio project): Next.js App Router (JS, not TS) + Prisma/PostgreSQL (Neon), Tailwind v4, Vercel Blob for product images.

## Commands

```
npm run dev       # next dev (localhost:3000)
npm run build     # prisma generate && prisma migrate deploy && next build
npm run lint      # eslint
npm run db:seed   # node prisma/seed.mjs — wipes nothing, upserts the fixed demo catalog/coupons
```

Unlike `comanda-demo` (`prisma generate && next build`, migrations applied by hand before deploying), this build runs `prisma migrate deploy` itself, so a fresh deploy is self-contained — the only manual step afterward is seeding once via `POST /api/demo/reset`.

**`directUrl` points at `DATABASE_URL_UNPOOLED`, not a separate `DIRECT_URL`.** This project's DB is provisioned through Vercel's Neon marketplace integration (Storage tab → Connect/Create Database), which names the pooled and unpooled connection strings `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — schema.prisma's `directUrl` references the latter directly rather than adding a redundant `DIRECT_URL` var. Gotcha: if you ever redo that "Connect Project" step and clear the "Custom Environment Variable Prefix" field first, the integration silently creates the variables with empty values instead of real connection strings (observed firsthand) — leave the prefix on its default, then either use the resulting `<PREFIX>_URL`-style vars or just rename/re-add the plain `DATABASE_URL`/`DATABASE_URL_UNPOOLED` pair it also creates alongside them.

No test suite exists in this repo.

Prisma workflow: edit `prisma/schema.prisma`, then `npx prisma migrate dev --name <desc>`, then `npx prisma generate` if the client needs regenerating. `DATABASE_URL`/`DIRECT_URL` come from `.env` (Neon pooled + direct in production; a local Postgres — e.g. `docker run -e POSTGRES_PASSWORD=vestra -e POSTGRES_DB=vestra -p 5433:5432 postgres:16` — works fine for dev). `BLOB_READ_WRITE_TOKEN` (from a Vercel Blob store linked to this project) is required for `/api/upload` to actually store images; without it the route returns a clear error instead of failing silently.

## Architecture

**Money is a plain `Int` (whole ARS pesos), not Prisma `Decimal`.** This is a deliberate deviation from how I'd normally do it (see `comanda-demo`, which uses `Decimal(10,2)`): Prisma's SQLite connector doesn't support `Decimal` at all, and using `Int` from the start means the schema never needs to change if local dev ever runs against SQLite instead of Postgres. `formatCurrency` (`lib/format.js`) rounds to 0 decimals, matching how ARS is casually displayed.

**No real auth, anywhere.** `app/page.js` (`/`) is a Comanda-style role picker — "Cliente" (→ `/inicio`, no gate) and "Administrador" (→ `enterAdmin()` then `/admin`) — plus the "Restablecer demo" button, all ungated since there's nothing to protect. `AdminProvider` (`components/AdminProvider.js`) just stores a boolean `vestra_admin` flag in `localStorage`; `app/admin/layout.js` is the enforcement point for everything under `/admin/*` — redirects to `/` whenever the flag isn't set, same UX-guidance-only pattern as `comanda-demo`'s `RoleProvider`. There's no server-side check re-validating admin status on the API routes; don't assume `/api/products` POST/PATCH/DELETE etc. are protected.

**Cart is client-side, coupon redemption is not.** `CartProvider` (`components/CartProvider.js`) keeps cart items in `localStorage` — that's fine, cart contents don't need to be globally consistent. Coupons are the one thing that does: a "cantidad limitada" coupon (e.g. "first 5 customers") only means something if the usage counter is shared across every visitor, which is why this repo has a real database at all (most of my other `-demo` repos don't). The split:
- `lib/coupons.js` `validateCoupon` — read-only, called by `POST /api/coupons/validate` whenever the cart's contents change or the customer clicks "Aplicar". Never touches `remainingUses`.
- `lib/coupons.js` `redeemCoupon` — called only from inside `lib/orders.js` `createOrder`'s `prisma.$transaction`, at actual checkout. Re-validates everything server-side (expiry, category eligibility, remaining uses) against the DB — never trusts the client — and decrements `remainingUses` atomically. An abandoned cart with a coupon "applied" never consumes a slot; only a completed simulated order does.

**Domain logic lives in `lib/`, not in route handlers.** Each feature has a `<Feature>Error(message, status)` class and route handlers just catch it and translate to a JSON response (mirrors `comanda-demo`): `lib/coupons.js` (`CouponError`), `lib/orders.js` (`OrderError`), `lib/products.js` (`ProductError`, `validateProductInput`), `lib/categories.js` (`CategoryError`). `lib/format.js` has `formatCurrency`/`formatDate`/`slugify`.

**Data model** (`prisma/schema.prisma`): `Category → Product → ProductImage`, `Category → CouponCategory ← Coupon`, `Product → OrderItem → Order`. `CouponCategory` is a plain explicit join table (a coupon either `appliesToAll` or targets specific categories via this join). `OrderItem` snapshots `productName`/`unitPrice` at the time of purchase so editing or deleting a product later doesn't corrupt past (simulated) order history.

**Route groups.** `/` is the role picker (see above), not part of the storefront. Public storefront: `/inicio` (landing + "quiénes somos"), `/tienda` (catalog, `?categoria=<slug>` filter), `/producto/[id]`, `/carrito` — all render `StoreHeader`, whose logo/"Inicio" link point at `/inicio`, not `/`. Admin: `/admin/*`, gated by `app/admin/layout.js` as described above; `/admin/productos` uses the shared `components/ProductForm.js` for both create and edit; `/admin/cupones` uses `components/CouponForm.js`. `app/api/<resource>/route.js` (+ `[id]/route.js`) are plain Route Handlers returning `{ error }` + a status code on failure, same as `comanda-demo`.

**Images**: admin uploads go through `POST /api/upload` (`@vercel/blob`'s `put()`, copied from `comanda-demo`), which returns a public URL stored on `ProductImage.url`. A product with zero images renders `components/ProductImagePlaceholder.js` (a `lucide-react` `Shirt` icon on a category-colored background) instead of a broken image — there's no seeded stock photography, only seeded catalog data (`lib/demoData.mjs`).

**Demo reset**: `POST /api/demo/reset` (`lib/demoReset.js`) wipes every table and reseeds the fixed catalog + 2 demo coupons, exposed as a button on `/` (the role picker) — same role as `comanda-demo`'s reset, since this is a public demo anyone can load garbage data into.

**Client conventions**: plain `.js` files, `"use client"` where needed, Tailwind utility classes, `lucide-react` icons, `@/*` path alias. UI copy is in Spanish (Argentina) — match this when adding strings.
