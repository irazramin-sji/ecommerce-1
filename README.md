# Norralco E-commerce Platform (Starter)

This repository is a Vite + React starter extended to implement a minimal, runnable subset of the Norralco e-commerce platform described in the Technical Specification.

What this commit includes
- Supabase migrations that create the core schema (users/profiles, categories, products, cart_items, orders, order_items, reviews, static_content, downloads, newsletter_subscribers) and seed a few example categories/products for local testing.
- Frontend features:
  - Home page with search and featured products.
  - Category listing page (`/category/:slug`).
  - Product detail page (`/product/:slug`) with add-to-cart (client-side).
  - Cart page with local cart (localStorage) and checkout simulation.
  - Login and Register pages wired to the starter `useAuth` golden hook (Supabase Auth).
  - Basic product service using the seeded Supabase client.
- Hooks: `useProducts`, `useCart`.
- Minimal product components: `ProductCard`, `ProductGrid`, `SearchBar`.

Important notes and implementation decisions
- Supabase Edge Functions: The full set of Edge Functions described in the spec (checkout intent creation, Stripe integration, admin endpoints, catalog importer) are out-of-scope for this initial runnable pass. The frontend uses the Supabase client directly to read products; persistent server-side operations (order creation, Stripe payment flows, transactional emails, admin CRUD) should be implemented in Supabase Edge Functions using the service role key for production.
- Checkout: The current checkout page simulates order placement locally and clears the cart. In production you must:
  - Implement `/api/checkout/intent` and `/api/checkout/confirm` as Supabase Edge Functions that create Stripe Payment Intents using server-only keys, confirm payment, create orders/order_items in Postgres, decrement product stock, generate/store invoice PDFs in Supabase Storage, and send transactional emails.
- Authentication: Login and registration pages call the project starter's `useAuth` hook which wraps Supabase Auth. Ensure your `.env` or Supabase project is set up and `supabase db push` (or migration apply) is run to create the tables used by the client.
- RLS: Migrations include row-level security policies for each table following the specification patterns (owner-only, admin override, public read for static content and active products).
- Admin features (products CRUD, catalog importer, review moderation, orders management) are not fully implemented in the frontend admin UI in this pass. The database schema and RLS are present to allow implementing those Edge Functions and admin UIs next.
- Media/Storage: Product image URLs are stored as plain text paths (example: `/storage/product-images/...`). For production, upload assets to Supabase Storage and reference the public URLs.

Setup (local development)
1. Install dependencies:
   npm install

2. Create a Supabase project and copy values into `.env` (see `.env.example` in the starter). Required variables typically include:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
   - SUPABASE_SERVICE_ROLE_KEY (for running migrations / edge functions locally — keep this secret)

3. Apply database migrations:
   Use the Supabase CLI or UI to run the SQL in `supabase/migrations/001_create_schema.sql`.
   Example with Supabase CLI:
     supabase db connect
     psql < supabase/migrations/001_create_schema.sql
   (Adjust depending on your environment.)

4. Run the dev server:
   npm run dev

Notes on missing pieces and next steps
- Implement Supabase Edge Functions for:
  - Product REST API with advanced filters and pagination.
  - Cart persistence for authenticated users.
  - Checkout flow with Stripe Payment Intents and webhook-driven order confirmation.
  - Catalog importer for large SKU batches.
  - Transactional email sending for account creation, password reset, and order confirmations.
- Build Admin Dashboard pages that call admin-protected Edge Functions, and ensure the frontend enforces admin-only routes.

If you need the next iteration (Edge Functions for checkout, catalog importer, admin CRUD UI), request "implement server-side Edge Functions and Admin pages" and I will add the relevant functions and pages.
