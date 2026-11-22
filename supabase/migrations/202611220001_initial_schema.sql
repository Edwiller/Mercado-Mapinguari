-- Mercado Mapinguari — esquema inicial do PostgreSQL/Supabase
-- Execute com `supabase db push` ou pelo fluxo de migrations do Supabase.

create extension if not exists pgcrypto;
create schema if not exists private;

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
create type public.payment_method as enum ('pix_demo', 'card_demo', 'wallet_demo');
create type public.inventory_movement_type as enum ('entry', 'sale', 'adjustment', 'cancellation');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text check (phone is null or char_length(phone) between 10 and 20),
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  icon text,
  sort_order integer not null default 0 check (sort_order >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  image_url text,
  sku text not null unique,
  unit text not null check (char_length(unit) between 1 and 30),
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  stock_quantity numeric(12,3) not null default 0 check (stock_quantity >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Casa',
  recipient_name text not null,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null default 'Rio Branco',
  state char(2) not null default 'AC',
  reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index carts_one_active_per_user on public.carts(user_id) where status = 'active';

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric(12,3) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code)),
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_order_value numeric(12,2) not null default 0 check (minimum_order_value >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > starts_at)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  coupon_id uuid references public.coupons(id) on delete set null,
  status public.order_status not null default 'pending',
  payment_method public.payment_method not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  shipping_fee numeric(12,2) not null default 0 check (shipping_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  idempotency_key uuid not null unique,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  sku text not null,
  unit text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity numeric(12,3) not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  movement_type public.inventory_movement_type not null,
  quantity numeric(12,3) not null check (quantity <> 0),
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_active_featured_idx on public.products(active, featured);
create index products_name_search_idx on public.products using gin (to_tsvector('portuguese', name));
create index addresses_user_id_idx on public.addresses(user_id);
create index carts_user_id_idx on public.carts(user_id);
create index cart_items_cart_id_idx on public.cart_items(cart_id);
create index orders_user_id_created_at_idx on public.orders(user_id, created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index inventory_product_created_at_idx on public.inventory_movements(product_id, created_at desc);

create function private.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Cliente'));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure private.handle_new_user();

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure private.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute procedure private.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute procedure private.set_updated_at();
create trigger addresses_set_updated_at before update on public.addresses for each row execute procedure private.set_updated_at();
create trigger carts_set_updated_at before update on public.carts for each row execute procedure private.set_updated_at();
create trigger cart_items_set_updated_at before update on public.cart_items for each row execute procedure private.set_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute procedure private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;

revoke all on table public.profiles, public.categories, public.products, public.addresses,
  public.carts, public.cart_items, public.coupons, public.orders, public.order_items,
  public.inventory_movements from anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select, insert, update, delete on public.addresses, public.carts, public.cart_items to authenticated;
grant select on public.coupons, public.orders, public.order_items to authenticated;
grant update (status) on public.orders to authenticated;
grant usage, select on sequence public.orders_order_number_seq to authenticated;

create policy categories_public_read on public.categories for select to anon, authenticated using (active = true);
create policy categories_admin_read on public.categories for select to authenticated using ((select private.is_admin()));
create policy categories_admin_insert on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy categories_admin_update on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy categories_admin_delete on public.categories for delete to authenticated using ((select private.is_admin()));

create policy products_public_read on public.products for select to anon, authenticated using (active = true);
create policy products_admin_read on public.products for select to authenticated using ((select private.is_admin()));
create policy products_admin_insert on public.products for insert to authenticated with check ((select private.is_admin()));
create policy products_admin_update on public.products for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy products_admin_delete on public.products for delete to authenticated using ((select private.is_admin()));

create policy profiles_own_read on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_admin_read on public.profiles for select to authenticated using ((select private.is_admin()));
create policy profiles_own_update on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy addresses_own_read on public.addresses for select to authenticated using ((select auth.uid()) = user_id);
create policy addresses_own_insert on public.addresses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy addresses_own_update on public.addresses for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy addresses_own_delete on public.addresses for delete to authenticated using ((select auth.uid()) = user_id);

create policy carts_own_read on public.carts for select to authenticated using ((select auth.uid()) = user_id);
create policy carts_own_insert on public.carts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy carts_own_update on public.carts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy carts_own_delete on public.carts for delete to authenticated using ((select auth.uid()) = user_id);

create policy cart_items_own_read on public.cart_items for select to authenticated using (exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = (select auth.uid())));
create policy cart_items_own_insert on public.cart_items for insert to authenticated with check (exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = (select auth.uid())));
create policy cart_items_own_update on public.cart_items for update to authenticated using (exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = (select auth.uid()))) with check (exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = (select auth.uid())));
create policy cart_items_own_delete on public.cart_items for delete to authenticated using (exists (select 1 from public.carts where carts.id = cart_items.cart_id and carts.user_id = (select auth.uid())));

create policy coupons_active_read on public.coupons for select to authenticated using (active and starts_at <= now() and (expires_at is null or expires_at > now()));
create policy coupons_admin_read on public.coupons for select to authenticated using ((select private.is_admin()));
create policy coupons_admin_insert on public.coupons for insert to authenticated with check ((select private.is_admin()));
create policy coupons_admin_update on public.coupons for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy coupons_admin_delete on public.coupons for delete to authenticated using ((select private.is_admin()));
create policy orders_own_read on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy orders_admin_read on public.orders for select to authenticated using ((select private.is_admin()));
create policy orders_admin_update on public.orders for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy order_items_own_read on public.order_items for select to authenticated using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = (select auth.uid())));
create policy order_items_admin_read on public.order_items for select to authenticated using ((select private.is_admin()));

create policy inventory_admin_read on public.inventory_movements for select to authenticated using ((select private.is_admin()));
create policy inventory_admin_insert on public.inventory_movements for insert to authenticated with check ((select private.is_admin()));

grant usage on schema private to authenticated;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

-- Operações administrativas adicionais são concedidas explicitamente e continuam limitadas por RLS.
grant insert, update, delete on public.categories, public.products to authenticated;
grant insert, update, delete on public.coupons to authenticated;
grant select, insert on public.inventory_movements to authenticated;

comment on table public.orders is 'Pedidos demonstrativos. A criação será feita por função transacional segura em módulo posterior.';
