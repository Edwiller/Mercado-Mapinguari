# Banco de Dados e Supabase

## Visão geral

O Mercado Mapinguari usa PostgreSQL hospedado pelo Supabase. O esquema inicial está em `supabase/migrations/202611220001_initial_schema.sql`, o checkout seguro em `supabase/migrations/202611220002_checkout_function.sql` e os dados demonstrativos em `supabase/seed.sql`.

## Entidades

- `profiles`: extensão segura do usuário autenticado, sem armazenar senha.
- `categories`: departamentos do supermercado.
- `products`: catálogo, preço e estoque disponível.
- `addresses`: endereços pertencentes ao cliente.
- `carts` e `cart_items`: carrinho persistente por usuário.
- `coupons`: regras promocionais.
- `orders` e `order_items`: pedidos e fotografia dos preços no momento da compra.
- `inventory_movements`: auditoria de entradas, vendas, ajustes e cancelamentos.

## Autenticação

As credenciais ficam no schema interno `auth` gerenciado pelo Supabase. Após um cadastro, o trigger `private.handle_new_user` cria automaticamente o registro correspondente em `public.profiles`. Senhas nunca são inseridas nas tabelas públicas.

## Segurança

- RLS está habilitado em todas as tabelas públicas.
- Visitantes anônimos podem ler somente categorias e produtos ativos.
- Clientes leem e alteram apenas o próprio perfil, endereços e carrinho.
- Clientes leem somente os próprios pedidos.
- Operações administrativas verificam a função `private.is_admin()` no banco.
- O front-end usa apenas a chave publicável; chaves secretas não devem ser copiadas para variáveis `VITE_`.
- Pedidos são criados somente pela função `public.checkout_cart`, que recalcula preços, valida endereço/cupom/estoque e registra a movimentação em uma única transação.

## Aplicar em um projeto Supabase

1. Crie um projeto em [supabase.com](https://supabase.com/).
2. Instale e autentique a Supabase CLI, ou utilize um ambiente de desenvolvimento com a CLI disponível.
3. Na raiz deste repositório, associe o projeto e envie as migrations:

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
supabase db seed
```

Alternativamente, a migration e o seed podem ser executados nessa ordem pelo SQL Editor do painel durante o desenvolvimento acadêmico.

4. No painel, em Authentication → URL Configuration, configure:

```text
Site URL: http://localhost:5173
Redirect URLs: http://localhost:5173/** e http://127.0.0.1:5173/**
```

5. Copie `.env.example` para `.env.local` e informe os valores exibidos na área Connect do projeto:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

6. Reinicie `npm.cmd run dev` após alterar variáveis de ambiente.

## Tornar um usuário administrador

Por segurança, o cadastro público sempre cria clientes. A promoção inicial deve ser feita manualmente no SQL Editor por uma pessoa autorizada:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DO_USUARIO';
```

Nunca disponibilize essa operação no cadastro público.

## Validação realizada

As migrations e o seed foram aplicados ao projeto Supabase conectado em São Paulo. Foram validados 9 categorias, 37 produtos, RLS nas tabelas públicas, gatilho de criação de perfil e a função transacional de checkout. O front-end passa em lint e build de produção.
