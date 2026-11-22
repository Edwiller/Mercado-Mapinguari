-- Checkout transacional: nenhum preço ou total enviado pelo navegador é confiado.
create or replace function public.checkout_cart(
  p_address_id uuid,
  p_coupon_code text default null,
  p_payment_method public.payment_method default 'pix_demo',
  p_idempotency_key uuid default gen_random_uuid(),
  p_notes text default null
)
returns table (order_id uuid, order_number bigint, total numeric)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_cart_id uuid;
  v_coupon public.coupons%rowtype;
  v_subtotal numeric(12,2);
  v_discount numeric(12,2) := 0;
  v_shipping numeric(12,2) := 0;
  v_total numeric(12,2);
  v_order_id uuid;
  v_order_number bigint;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if not exists (
    select 1 from public.addresses
    where id = p_address_id and user_id = v_user_id
  ) then
    raise exception 'INVALID_ADDRESS';
  end if;

  select id into v_cart_id
  from public.carts
  where user_id = v_user_id and status = 'active'
  for update;

  if v_cart_id is null or not exists (select 1 from public.cart_items where cart_id = v_cart_id) then
    raise exception 'EMPTY_CART';
  end if;

  perform p.id
  from public.products p
  join public.cart_items ci on ci.product_id = p.id
  where ci.cart_id = v_cart_id
  order by p.id
  for update of p;

  if exists (
    select 1
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.cart_id = v_cart_id
      and (not p.active or ci.quantity > p.stock_quantity)
  ) then
    raise exception 'INSUFFICIENT_STOCK';
  end if;

  select round(sum(p.price * ci.quantity), 2)
  into v_subtotal
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.cart_id = v_cart_id;

  if nullif(trim(p_coupon_code), '') is not null then
    select * into v_coupon
    from public.coupons
    where code = upper(trim(p_coupon_code))
      and active
      and starts_at <= now()
      and (expires_at is null or expires_at > now())
      and (usage_limit is null or used_count < usage_limit)
    for update;

    if not found then
      raise exception 'INVALID_COUPON';
    end if;
    if v_subtotal < v_coupon.minimum_order_value then
      raise exception 'COUPON_MINIMUM_NOT_REACHED';
    end if;

    v_discount := case v_coupon.discount_type
      when 'percentage' then round(v_subtotal * v_coupon.discount_value / 100, 2)
      else least(v_coupon.discount_value, v_subtotal)
    end;
  end if;

  v_shipping := case when v_subtotal >= 149 then 0 else 14.90 end;
  v_total := greatest(v_subtotal - v_discount + v_shipping, 0);

  insert into public.orders (
    user_id, address_id, coupon_id, payment_method, subtotal, discount,
    shipping_fee, total, idempotency_key, notes
  ) values (
    v_user_id, p_address_id, v_coupon.id, p_payment_method, v_subtotal, v_discount,
    v_shipping, v_total, p_idempotency_key, nullif(trim(p_notes), '')
  )
  returning id, orders.order_number into v_order_id, v_order_number;

  insert into public.order_items (
    order_id, product_id, product_name, sku, unit, unit_price, quantity, line_total
  )
  select v_order_id, p.id, p.name, p.sku, p.unit, p.price, ci.quantity,
         round(p.price * ci.quantity, 2)
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.cart_id = v_cart_id;

  update public.products p
  set stock_quantity = p.stock_quantity - ci.quantity
  from public.cart_items ci
  where ci.cart_id = v_cart_id and ci.product_id = p.id;

  insert into public.inventory_movements (
    product_id, order_id, movement_type, quantity, reason, created_by
  )
  select ci.product_id, v_order_id, 'sale', -ci.quantity,
         'Venda do pedido ' || v_order_number, v_user_id
  from public.cart_items ci
  where ci.cart_id = v_cart_id;

  if v_coupon.id is not null then
    update public.coupons set used_count = used_count + 1 where id = v_coupon.id;
  end if;

  update public.carts set status = 'converted' where id = v_cart_id;

  return query select v_order_id, v_order_number, v_total;
end;
$$;

revoke all on function public.checkout_cart(uuid, text, public.payment_method, uuid, text) from public;
grant execute on function public.checkout_cart(uuid, text, public.payment_method, uuid, text) to authenticated;

comment on function public.checkout_cart(uuid, text, public.payment_method, uuid, text)
is 'Cria pedido de demonstração de forma atômica, recalculando valores e estoque no servidor.';
