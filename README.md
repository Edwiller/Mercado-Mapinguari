# Mercado Mapinguari — Seu mercado, nossa terra

Fundação do supermercado virtual Mercado Mapinguari, projeto acadêmico de comércio eletrônico com identidade inspirada no Acre e na Amazônia.

> Estado atual: marketplace responsivo conectado ao Supabase, com catálogo real, autenticação, carrinho persistente, endereços, checkout transacional demonstrativo e histórico de pedidos.

## Tecnologias

- React 19 e TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase Auth e PostgreSQL com RLS
- ESLint

## Pré-requisitos

- Node.js 22 ou superior
- npm 10 ou superior

## Executar localmente

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`).

## Scripts

```bash
npm run dev       # servidor local com atualização automática
npm run build     # valida tipos e gera a versão de produção
npm run lint      # analisa o código com ESLint
npm run preview   # visualiza localmente a versão de produção
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e informe a URL e a chave publicável do seu projeto Supabase. Variáveis acessíveis no navegador começam com `VITE_`. Nunca inclua chaves secretas ou `service_role` no front-end. Consulte [o guia do banco](docs/banco-de-dados.md).

## Estrutura inicial

```text
src/
├── app/          # composição global da aplicação
├── components/   # componentes reutilizáveis
├── layouts/      # estruturas compartilhadas entre páginas
├── pages/        # páginas associadas às rotas
├── routes/       # configuração de navegação
├── lib/          # cliente de integrações externas
├── services/     # consultas e comandos do Supabase
├── contexts/     # autenticação e carrinho persistente
├── styles/       # estilos globais e tema
└── types/        # tipos compartilhados (módulos futuros)
```

## Escopo e evolução

A aplicação possui homepage responsiva, catálogo filtrável, detalhes de produto, autenticação, recuperação de senha, carrinho, checkout demonstrativo e área do cliente. Consulte [a arquitetura](docs/arquitetura.md), [o banco de dados](docs/banco-de-dados.md) e [o esqueleto do relatório acadêmico](docs/relatorio-final.md).

## Imagens demonstrativas

As fotografias remotas usadas na vitrine são provenientes do Unsplash e de uma imagem do Unsplash distribuída pela Her Campus. Elas servem exclusivamente à prototipação acadêmica. Antes da publicação final, os ativos devem ser baixados, otimizados e ter sua licença e atribuição revisadas. Consulte `docs/identidade-visual.md`.

## Licença e aviso

Projeto demonstrativo e acadêmico. O Mercado Mapinguari não realiza vendas ou cobranças reais nesta etapa.
