-- 001_create_schema.sql
-- Initial schema for Norralco e-commerce platform (minimal subset)
-- Includes core tables: users (profiles), categories, products, cart_items, orders, order_items, reviews, static_content, downloads, newsletter_subscribers
-- RLS policies applied per specification

-- Enable uuid extension
create extension if not exists "uuid-ossp";

-- Profiles table (links to Supabase Auth users)
create table if not exists users (
  id uuid primary key references auth.users not null,
  email text unique,
  role text default 'customer' check (role in ('customer','admin')),
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row-level security for profiles: owners & admins
alter table users enable row level security;

create policy "Profiles: self or admin can select" on users
  for select using (
    auth.role() = 'anon' = false and (
      auth.uid() = id OR EXISTS (
        select 1 from auth.users u where u.id = auth.uid() and (
          -- Admins detect from a claim; fallback to role in profiles (admin)
          (select role from users where id = auth.uid()) = 'admin'
        )
      )
    )
  );

create policy "Profiles: self can update" on users
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  description text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table categories enable row level security;

-- Public read policy for categories
create policy "Categories: public_read" on categories
  for select using (true);

create policy "Categories: admin_crud" on categories
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sku text not null unique,
  description text,
  price numeric(10,2) not null default 0,
  stock integer not null default 0,
  category_id uuid references categories(id) on delete set null,
  material text,
  shape text,
  length text,
  tip_size text,
  images text[], -- array of storage URLs
  videos text[],
  user_guides text[],
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table products enable row level security;

-- Public read only for active products
create policy "Products: public_read_active" on products
  for select using (is_active = true);

-- Admin full access
create policy "Products: admin_crud" on products
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Cart items (persistent cart for authenticated users)
create table if not exists cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  quantity integer not null default 1,
  variant_attributes jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table cart_items enable row level security;

create policy "Cart: owner_crud" on cart_items
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Orders and order items (simplified)
create type order_status as enum ('pending','processing','shipped','delivered','cancelled','refunded');

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  order_date timestamptz default now(),
  total_amount numeric(10,2) not null default 0,
  status order_status default 'pending',
  shipping_address_id uuid,
  billing_address_id uuid,
  payment_intent_id text,
  tracking_number text,
  shipping_carrier text,
  invoice_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Orders: owner_read" on orders
  for select using (auth.uid() = user_id);

create policy "Orders: owner_insert" on orders
  for insert with check (auth.uid() = user_id);

create policy "Orders: admin_all" on orders
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  variant_attributes jsonb default '{}'::jsonb
);

alter table order_items enable row level security;

create policy "OrderItems: owner_read" on order_items
  for select using (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()));

create policy "OrderItems: admin_all" on order_items
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Reviews
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  is_approved boolean default false
);

alter table reviews enable row level security;

create policy "Reviews: public_read_approved" on reviews
  for select using (is_approved = true);

create policy "Reviews: user_crud_own" on reviews
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Reviews: admin_crud" on reviews
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Static content
create table if not exists static_content (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table static_content enable row level security;

create policy "Static: public_read" on static_content
  for select using (true);

create policy "Static: admin_crud" on static_content
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Downloads
create type download_type as enum ('pdf','video','document');

create table if not exists downloads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  file_url text not null,
  type download_type not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table downloads enable row level security;

create policy "Downloads: public_read" on downloads
  for select using (true);

create policy "Downloads: admin_crud" on downloads
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Newsletter subscribers
create table if not exists newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Newsletter: admin_read_delete" on newsletter_subscribers
  for all using ( (select role from users where id = auth.uid()) = 'admin' )
  with check ( (select role from users where id = auth.uid()) = 'admin' );

-- Seed minimal categories and products for local development
insert into categories (id, name, slug, description)
values
  (uuid_generate_v4(), 'Surgical', 'surgical', 'Surgical instruments and tools'),
  (uuid_generate_v4(), 'Dental', 'dental', 'Dental instruments and supplies'),
  (uuid_generate_v4(), 'Veterinary', 'veterinary', 'Veterinary instruments')
on conflict (slug) do nothing;

-- Example products
with c as (select id from categories where slug = 'surgical' limit 1)
insert into products (name, slug, sku, description, price, stock, category_id, material, shape, length, tip_size, images, is_active)
select
  'Metzenbaum Scissors 14cm', 'metzenbaum-scissors-14cm', 'NOR-METZ-14', 'Fine dissection scissors', 29.99, 120, c.id, 'Stainless Steel', 'Straight', '14cm', 'Fine', array['/storage/product-images/metzenbaum-14-1.jpg'], true
from c
on conflict (slug) do nothing;

insert into products (name, slug, sku, description, price, stock, category_id, material, shape, length, tip_size, images, is_active)
select
  'Adson Forceps 12cm', 'adson-forceps-12cm', 'NOR-ADSON-12', 'Thumb forceps with fine tips', 12.5, 200, (select id from categories where slug = 'surgical'), 'Stainless Steel', 'Curved', '12cm', 'Fine', array['/storage/product-images/adson-12-1.jpg'], true
on conflict (slug) do nothing;

-- End of migration
