insert into public.categories (name, slug, description, icon, sort_order) values
  ('Hortifruti', 'hortifruti', 'Frutas, verduras, legumes e temperos frescos.', '🥬', 10),
  ('Mercearia', 'mercearia', 'Alimentos básicos, enlatados, massas e grãos.', '🛒', 20),
  ('Bebidas', 'bebidas', 'Águas, sucos, refrigerantes e outras bebidas.', '🧃', 30),
  ('Produtos regionais', 'produtos-regionais', 'Sabores e ingredientes da Amazônia.', '🌿', 40),
  ('Padaria', 'padaria', 'Pães, bolos e itens preparados diariamente.', '🥖', 50),
  ('Açougue', 'acougue', 'Carnes bovinas, suínas e aves.', '🥩', 60),
  ('Laticínios', 'laticinios', 'Leites, queijos, iogurtes e derivados.', '🥛', 70),
  ('Limpeza', 'limpeza', 'Produtos para limpeza e cuidado da casa.', '🧹', 80),
  ('Higiene', 'higiene', 'Cuidados pessoais e higiene da família.', '🧴', 90)
on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;

insert into public.products (category_id, name, slug, description, image_url, sku, unit, price, compare_at_price, stock_quantity, featured)
select c.id, p.name, p.slug, p.description, p.image_url, p.sku, p.unit, p.price, p.compare_at_price, p.stock_quantity, p.featured
from (values
  ('hortifruti', 'Banana prata selecionada', 'banana-prata', 'Banana prata fresca selecionada por peso.', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=640&q=82', 'HORT-001', 'kg', 7.49, 8.99, 80.000, true),
  ('mercearia', 'Café amazônico torrado e moído', 'cafe-amazonico', 'Café de aroma intenso em embalagem de 500 g.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=640&q=82', 'MERC-001', '500 g', 18.90, 22.90, 120.000, true),
  ('bebidas', 'Suco de laranja integral', 'suco-laranja-integral', 'Suco integral sem adição de açúcar.', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=640&q=82', 'BEB-001', '1 L', 12.49, 14.49, 60.000, true),
  ('produtos-regionais', 'Castanha-do-pará sem casca', 'castanha-do-para', 'Castanhas selecionadas em embalagem de 250 g.', 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=640&q=82', 'REG-001', '250 g', 24.90, 29.90, 45.000, true),
  ('produtos-regionais', 'Polpa de açaí puro congelada', 'acai-polpa', 'Polpa de açaí congelada sem mistura.', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=640&q=82', 'REG-002', '500 g', 16.90, null, 55.000, true),
  ('produtos-regionais', 'Farinha de mandioca artesanal', 'farinha-mandioca', 'Farinha de mandioca de produtor local.', 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=640&q=82', 'REG-003', '1 kg', 11.49, null, 65.000, false),
  ('produtos-regionais', 'Polpa de cupuaçu congelada', 'cupuacu-polpa', 'Polpa de cupuaçu congelada.', 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=640&q=82', 'REG-004', '400 g', 14.90, null, 48.000, false),
  ('produtos-regionais', 'Mel silvestre da floresta', 'mel-floresta', 'Mel artesanal de origem silvestre.', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=640&q=82', 'REG-005', '300 g', 27.90, null, 30.000, true),
  ('padaria', 'Pão artesanal da casa', 'pao-artesanal', 'Pão de fermentação lenta preparado diariamente.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=82', 'PAD-001', '450 g', 12.90, null, 30.000, true),
  ('acougue', 'Patinho bovino resfriado', 'patinho-bovino', 'Corte bovino resfriado vendido por peso.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=640&q=82', 'ACO-001', 'kg', 39.90, 44.90, 50.000, true),
  ('laticinios', 'Leite integral longa vida', 'leite-integral', 'Leite integral UHT em embalagem de 1 litro.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=640&q=82', 'LAT-001', '1 L', 5.79, 6.49, 180.000, true),
  ('limpeza', 'Detergente neutro', 'detergente-neutro', 'Detergente líquido neutro para louças.', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=640&q=82', 'LIM-001', '500 ml', 2.89, 3.29, 150.000, false),
  ('higiene', 'Sabonete vegetal', 'sabonete-vegetal', 'Sabonete vegetal suave para uso diário.', 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=640&q=82', 'HIG-001', '90 g', 3.49, 3.99, 140.000, false),
  ('hortifruti', 'Tomate italiano fresco', 'tomate-italiano', 'Tomates frescos selecionados por peso.', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=640&q=82', 'HORT-002', 'kg', 8.99, 10.49, 65.000, true),
  ('hortifruti', 'Maçã gala selecionada', 'maca-gala', 'Maçãs gala frescas selecionadas.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=640&q=82', 'HORT-003', 'kg', 11.90, null, 70.000, false),
  ('hortifruti', 'Alface crespa hidropônica', 'alface-crespa', 'Alface hidropônica de produtor local.', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=640&q=82', 'HORT-004', 'unidade', 4.49, null, 42.000, false),
  ('mercearia', 'Arroz branco tipo 1', 'arroz-tipo-1', 'Arroz branco tipo 1 selecionado.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=82', 'MERC-002', '5 kg', 27.90, 31.90, 100.000, true),
  ('mercearia', 'Macarrão espaguete grano duro', 'macarrao-espaguete', 'Massa de grano duro para o dia a dia.', 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=640&q=82', 'MERC-003', '500 g', 6.49, null, 130.000, false),
  ('mercearia', 'Feijão carioca selecionado', 'feijao-carioca', 'Feijão carioca tipo 1.', 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=640&q=82', 'MERC-004', '1 kg', 8.79, 9.99, 95.000, true),
  ('bebidas', 'Água mineral sem gás', 'agua-mineral', 'Água mineral natural sem gás.', 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=640&q=82', 'BEB-002', '1,5 L', 2.49, null, 240.000, false),
  ('bebidas', 'Refrigerante sabor guaraná', 'refrigerante-guarana', 'Refrigerante sabor guaraná.', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=640&q=82', 'BEB-003', '2 L', 8.99, 10.49, 85.000, true),
  ('bebidas', 'Água de coco integral', 'agua-coco', 'Água de coco integral pronta para beber.', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=640&q=82', 'BEB-004', '500 ml', 6.90, null, 70.000, false),
  ('padaria', 'Croissant de manteiga', 'croissant-manteiga', 'Croissant folhado preparado diariamente.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=640&q=82', 'PAD-002', 'unidade', 7.90, null, 24.000, false),
  ('padaria', 'Bolo caseiro de chocolate', 'bolo-chocolate', 'Bolo de chocolate preparado na padaria.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=640&q=82', 'PAD-003', '600 g', 24.90, null, 18.000, true),
  ('padaria', 'Pão francês tradicional', 'pao-frances', 'Pão francês assado ao longo do dia.', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=640&q=82', 'PAD-004', 'kg', 16.90, null, 35.000, false),
  ('acougue', 'Filé de peito de frango', 'file-frango', 'Filé de peito de frango resfriado.', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=640&q=82', 'ACO-002', 'kg', 21.90, 24.90, 60.000, true),
  ('acougue', 'Carne bovina moída', 'carne-moida', 'Carne bovina moída preparada na hora.', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=640&q=82', 'ACO-003', 'kg', 32.90, null, 45.000, false),
  ('acougue', 'Contrafilé bovino em bifes', 'contrafile', 'Contrafilé bovino selecionado em bifes.', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=640&q=82', 'ACO-004', 'kg', 49.90, 54.90, 38.000, true),
  ('laticinios', 'Queijo muçarela fatiado', 'queijo-mucarela', 'Queijo muçarela fatiado.', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=640&q=82', 'LAT-002', '300 g', 14.90, null, 75.000, false),
  ('laticinios', 'Iogurte natural integral', 'iogurte-natural', 'Iogurte natural integral.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=640&q=82', 'LAT-003', '170 g', 5.49, 6.29, 90.000, true),
  ('laticinios', 'Manteiga com sal', 'manteiga-com-sal', 'Manteiga tradicional com sal.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=640&q=82', 'LAT-004', '200 g', 12.90, null, 70.000, false),
  ('limpeza', 'Lava-roupas líquido', 'lava-roupas', 'Lava-roupas líquido concentrado.', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=640&q=82', 'LIM-002', '3 L', 18.90, 21.90, 80.000, true),
  ('limpeza', 'Desinfetante floral concentrado', 'desinfetante-floral', 'Desinfetante de fragrância floral.', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=640&q=82&sat=-20', 'LIM-003', '2 L', 8.49, null, 90.000, false),
  ('limpeza', 'Limpador multiuso', 'limpador-multiuso', 'Limpador multiuso para superfícies.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=640&q=82', 'LIM-004', '500 ml', 6.29, null, 105.000, false),
  ('higiene', 'Shampoo hidratação diária', 'shampoo-hidratacao', 'Shampoo para hidratação diária.', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=640&q=82', 'HIG-002', '400 ml', 16.90, 19.90, 85.000, true),
  ('higiene', 'Creme dental proteção total', 'creme-dental', 'Creme dental de proteção total.', 'https://images.unsplash.com/photo-1559591937-e13e7ac0e5f6?auto=format&fit=crop&w=640&q=82', 'HIG-003', '90 g', 7.49, null, 120.000, false),
  ('higiene', 'Papel higiênico folha dupla', 'papel-higienico', 'Papel higiênico folha dupla.', 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=640&q=82', 'HIG-004', '12 rolos', 17.90, 21.90, 95.000, true)
) as p(category_slug, name, slug, description, image_url, sku, unit, price, compare_at_price, stock_quantity, featured)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id, name = excluded.name, description = excluded.description,
  image_url = excluded.image_url, unit = excluded.unit, price = excluded.price,
  compare_at_price = excluded.compare_at_price, stock_quantity = excluded.stock_quantity, featured = excluded.featured;

insert into public.coupons (code, description, discount_type, discount_value, minimum_order_value)
values ('BEMVINDO', 'Cupom demonstrativo de primeira compra', 'percentage', 10, 149)
on conflict (code) do nothing;
