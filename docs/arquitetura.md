# Arquitetura

## Visão geral

O Mercado Mapinguari é uma SPA React 19 escrita em TypeScript e servida pelo Vite. O React Router organiza as rotas em carregamento sob demanda, enquanto o Supabase fornece autenticação, PostgreSQL, API e políticas de acesso.

```text
index.html → main.tsx → App → Providers → Router → Layout → Página
                                  ↓
                    Supabase Auth + PostgreSQL/RLS
```

## Camadas

- `app`: composição dos providers globais.
- `components`: peças visuais reutilizáveis.
- `contexts`: sessão autenticada e carrinho persistente.
- `hooks`: acesso tipado aos contextos e ao catálogo.
- `layouts`: cabeçalho, conteúdo e rodapé compartilhados.
- `pages`: homepage, catálogo, produto, autenticação, carrinho, checkout, conta e pedidos.
- `routes`: rotas públicas e protegidas com divisão de código.
- `services`: consultas e comandos do Supabase.
- `lib`: inicialização segura do cliente Supabase.
- `types`: contratos compartilhados.
- `styles`: tema, animações e adaptações responsivas.

## Fluxos principais

1. Visitantes consultam categorias e produtos ativos por políticas públicas de leitura.
2. O carrinho começa no armazenamento local; após login, é sincronizado com `carts` e `cart_items`.
3. Endereços pertencem exclusivamente ao usuário autenticado.
4. O checkout chama `public.checkout_cart`; o navegador nunca determina o preço final nem altera estoque diretamente.
5. Pedidos e itens podem ser lidos somente pelo proprietário ou por administradores.

## Segurança

- Apenas URL e chave publicável ficam no front-end.
- Senhas permanecem no Supabase Auth.
- RLS está ativo em todas as tabelas públicas.
- Operações críticas usam funções `security definer` com `search_path` vazio e validações explícitas.
- Pagamentos são exclusivamente demonstrativos; não há captura de cartão nem cobrança real.
